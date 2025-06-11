from fastapi import APIRouter, HTTPException, Header
from app.auth import verify_id_token
import uuid

router = APIRouter()

# Simulated in-memory storage for voice cloning results
vc_store = {}

def mock_clone_voice(text: str, user_id: str) -> str:
    # Mock result: URL to synthesized voice using cloned voice profile
    return f"https://mock-voice.com/clone/{user_id}/{uuid.uuid4()}.mp3"

@router.post("/")
async def clone_voice(input: dict, id_token: str = Header(...)):
    try:
        user_id = verify_id_token(id_token)
        text = input.get("text", "")
        if not text:
            raise HTTPException(status_code=400, detail="Text input is required")

        cloned_audio_url = mock_clone_voice(text, user_id)
        vc_id = str(uuid.uuid4())

        vc_store[vc_id] = {
            "user_id": user_id,
            "text": text,
            "voice_url": cloned_audio_url
        }

        return {
            "id": vc_id,
            "voice_url": cloned_audio_url
        }

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.get("/{vc_id}")
async def get_voice_cloning(vc_id: str, id_token: str = Header(...)):
    try:
        user_id = verify_id_token(id_token)

        if vc_id not in vc_store:
            raise HTTPException(status_code=404, detail="Voice clone result not found")

        record = vc_store[vc_id]
        if record["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this result")

        return record

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.delete("/{vc_id}")
async def delete_voice_cloning(vc_id: str, id_token: str = Header(...)):
    try:
        user_id = verify_id_token(id_token)

        if vc_id not in vc_store:
            raise HTTPException(status_code=404, detail="Voice clone result not found")

        record = vc_store[vc_id]
        if record["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this result")

        del vc_store[vc_id]
        return {"message": f"Voice clone result {vc_id} deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
