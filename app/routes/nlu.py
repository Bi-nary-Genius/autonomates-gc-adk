from fastapi import APIRouter, HTTPException, Header
from app.auth import verify_token

router = APIRouter()

@router.post("/")
async def analyze_emotion(id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)
        
        return {"message": f"NLU analysis done for user {user_id}"}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    
@router.get("/")
async def get_nlu():
    return {"message": "GET NLU placeholder"}

