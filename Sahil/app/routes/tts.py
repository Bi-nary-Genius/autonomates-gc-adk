from fastapi import APIRouter, HTTPException, Header
from app.auth import verify_token
from pydantic import BaseModel

class TTSUpdateRequest(BaseModel):
    # We need define the fields:
    text: str
    voice: str
    
router = APIRouter()

@router.post("/create")#we can change the route
async def text_to_speech(id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)
        
        return {"message": f"TTS request processed for user {user_id}"}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.get("/")
async def get_tts():
    return {"message": "GET TTS placeholder"}

#For put
@router.put("/update")
async def update_tts(payload: TTSUpdateRequest, id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)

        # Store or update TTS request in Firestore
        db.collection("tts_requests").document(user_id).set({
            "text": payload.text,
            "voice": payload.voice,
            "updated_at": datetime.utcnow()
        }, merge=True)

        return {
            "user_id": user_id,
            "message": "TTS request updated successfully",
            "text": payload.text,
            "voice": payload.voice
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/delete")
async def delete_tts(id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)

        # Delete the user's TTS document from Firestore
        db.collection("tts_requests").document(user_id).delete()

        return {"message": f"TTS request deleted for user {user_id}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))