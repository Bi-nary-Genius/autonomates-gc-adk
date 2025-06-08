from fastapi import APIRouter, HTTPException, Header
from app.auth import verify_token
from pydantic import BaseModel
router = APIRouter()
class VoiceCloningUpdateRequest(BaseModel):
    voice_name: str
    sample_url: str

@router.post("/")#we can change the route
async def clone_voice(id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)
        
        return {"message": f"Voice cloned for user {user_id}"}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.get("/")
async def get_voice_cloning():
    return {"message": "GET Voice Cloning placeholder"}

#For put
@router.put("/")
async def update_cloned_voice(payload: VoiceCloningUpdateRequest, id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)

        # Reference to Firestore document: voice_cloning/{user_id}
        doc_ref = db.collection("voice_cloning").document(user_id)
        doc_ref.set({
            "voice_name": payload.voice_name,
            "sample_url": payload.sample_url,
            "updated_at": datetime.utcnow()
        }, merge=True)

        return {
            "user_id": user_id,
            "message": "Voice cloning data updated successfully",
            "voice_name": payload.voice_name,
            "sample_url": payload.sample_url
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# For delete this 
@router.delete("/")
async def delete_cloned_voice(id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)

        # Reference to Firestore document
        db.collection("voice_cloning").document(user_id).delete()

        return {"message": f"Voice cloning data deleted for user {user_id}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))