from fastapi import APIRouter, UploadFile, File, Header, HTTPException
from app.auth import verify_id_token

router = APIRouter()

@router.post("/")
async def speech_to_text(file: UploadFile = File(...), id_token: str = Header(...)):
    try:
        user_id = verify_id_token(id_token)
        
        # Mock Results
        transcript = "Imagine if I moved to Paris"  # Mock Script

        return {"transcript": transcript}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
