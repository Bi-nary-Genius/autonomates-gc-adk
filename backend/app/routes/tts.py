from fastapi import APIRouter, HTTPException, Header
from app.auth import verify_id_token, db
from google.cloud import texttospeech
from google.cloud.texttospeech import TextToSpeechClient, SynthesisInput, VoiceSelectionParams, AudioConfig, AudioEncoding
from google.cloud import storage, firestore
from pydantic import BaseModel
import uuid

# --- Configuration ---
GCS_BUCKET_NAME = "whatif-backend-462323.firebasestorage.app"


# --- Pydantic Request Model ---
class TTSRequest(BaseModel):
    text: str

# --- Initialize Clients ---
router = APIRouter()
tts_client = TextToSpeechClient()
storage_client = storage.Client()

# --- Helper: Upload to GCS ---
def upload_audio_to_gcs(audio_content: bytes, tts_id: str) -> str:
    try:
        bucket = storage_client.bucket(GCS_BUCKET_NAME)
        blob_name = f"tts_audio/{tts_id}.mp3"
        blob = bucket.blob(blob_name)
        blob.upload_from_string(audio_content, content_type="audio/mp3")
        blob.make_public()
        return blob.public_url
    except Exception as e:
        print(f"GCS upload error for TTS ID {tts_id}: {e}")
        raise Exception(f"Failed to upload audio to GCS: {e}")

# --- Helper: Synthesize Speech ---
def synthesize_speech(text: str) -> tuple:
    try:
        input_text = SynthesisInput(text=text)
        voice = VoiceSelectionParams(
            language_code="en-US",
            ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
        )
        audio_config = AudioConfig(audio_encoding=AudioEncoding.MP3)
        response = tts_client.synthesize_speech(
            input=input_text, voice=voice, audio_config=audio_config
        )
        tts_id = str(uuid.uuid4())
        audio_url = upload_audio_to_gcs(response.audio_content, tts_id)
        return tts_id, audio_url
    except Exception as e:
        print(f"TTS synthesis or GCS upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to synthesize speech: {e}")

# --- Endpoint: Generate Speech ---
@router.post("/generate")
async def generate_speech(request: TTSRequest, id_token: str = Header(...)):
    try:
        user_id = verify_id_token(id_token)
        text = request.text.strip()
        if not text:
            raise HTTPException(status_code=400, detail="Text input is required.")

        tts_id, audio_url = synthesize_speech(text)

        tts_data = {
            "user_id": user_id,
            "text": text,
            "audio_url": audio_url,
            "created_at": firestore.SERVER_TIMESTAMP
        }
        db.collection("tts_results").document(tts_id).set(tts_data)

        return {
            "id": tts_id,
            "audioUrl": audio_url
        }
    except ValueError as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {e}")
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Unhandled error in /tts/generate: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred during speech generation.")

# --- Endpoint: Retrieve Speech Metadata ---
@router.get("/{tts_id}")
async def get_speech_details(tts_id: str, id_token: str = Header(...)):
    try:
        user_id = verify_id_token(id_token)
        doc_ref = db.collection("tts_results").document(tts_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Audio not found.")

        data = doc.to_dict()
        if data.get("user_id") != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this audio.")

        return {
            "id": tts_id,
            "text": data.get("text"),
            "audioUrl": data.get("audio_url")
        }
    except ValueError as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {e}")
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Unhandled error in /tts/{{tts_id}}: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred during audio retrieval.")
