from fastapi import APIRouter, HTTPException, Header
from app.auth import verify_token

router = APIRouter()

@router.post("/")
async def generate_scenario(id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)
        # Placeholder response
        return {"message": f"Scenario generated for user {user_id}"}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
