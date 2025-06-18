from fastapi import APIRouter, HTTPException, Header
from app.auth import verify_id_token, db
from google.cloud import texttospeech
import uuid
import base64

router = APIRouter()

# Initialize Google Cloud TTS client
tts_client = texttospeech.TextToSpeechClient()

def synthesize_speech(text: str) -> str:
    try:
        input_text = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        response = tts_client.synthesize_speech(
            input=input_text, voice=voice, audio_config=audio_config
        )

     
        audio_base64 = base64.b64encode(response.audio_content).decode("utf-8")
        return audio_base64

    except Exception as e:
        print(f"TTS synthesis error: {e}")
        raise Exception("Failed to synthesize speech")

@router.post("/")
async def text_to_speech(input: dict, id_token: str = Header(...)):
    try:
        user_id = verify_id_token(id_token)
        text = input.get("text", "").strip()
        if not text:
            raise HTTPException(status_code=400, detail="Text input is required")

        audio_base64 = synthesize_speech(text)
        tts_id = str(uuid.uuid4())

        tts_data = {
            "user_id": user_id,
            "text": text,
            "audio_base64": audio_base64
        }
        db.collection("tts_results").document(tts_id).set(tts_data)

        return {
            "id": tts_id,
            "audio_base64": audio_base64
        }

    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"TTS API error: {e}")
        raise HTTPException(status_code=400, detail="Could not process request.")
