from fastapi import APIRouter, HTTPException, Header
from app.auth import verify_token
import uuid

router = APIRouter()

# Simulated in-memory storage for TTS results
tts_store = {}

def mock_generate_audio_url(text: str) -> str:
    # Mock TTS audio URL generation (could be replaced with real API)
    return f"https://mock-storage.com/audio/{uuid.uuid4()}.mp3"

@router.post("/")
async def text_to_speech(input: dict, id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)
        text = input.get("text", "")
        if not text:
            raise HTTPException(status_code=400, detail="Text input is required")

        audio_url = mock_generate_audio_url(text)
        tts_id = str(uuid.uuid4())

        tts_store[tts_id] = {
            "user_id": user_id,
            "text": text,
            "audio_url": audio_url
        }

        return {
            "id": tts_id,
            "audio_url": audio_url
        }

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.get("/{tts_id}")
async def get_tts(tts_id: str, id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)

        if tts_id not in tts_store:
            raise HTTPException(status_code=404, detail="TTS result not found")

        record = tts_store[tts_id]
        if record["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this result")

        return record

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.delete("/{tts_id}")
async def delete_tts(tts_id: str, id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)

        if tts_id not in tts_store:
            raise HTTPException(status_code=404, detail="TTS result not found")

        record = tts_store[tts_id]
        if record["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this result")

        del tts_store[tts_id]
        return {"message": f"TTS result {tts_id} deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
