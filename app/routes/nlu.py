from fastapi import APIRouter, HTTPException, Header
from app.auth import verify_id_token
import uuid

router = APIRouter()

# Simulated in-memory store for NLU results
nlu_store = {}

def mock_nlu_analysis(text: str):
    # Mock NLU: extract keywords and fake intent
    keywords = [word for word in text.split() if len(word) > 4]
    intent = "life_decision" if "move" in text or "change" in text else "general_reflection"
    emotion = "curious" if "?" in text else "neutral"
    return {
        "keywords": keywords,
        "intent": intent,
        "emotion": emotion
    }

@router.post("/")
async def analyze_emotion(input: dict, id_token: str = Header(...)):
    try:
        user_id = verify_id_token(id_token)
        text = input.get("text", "")
        if not text:
            raise HTTPException(status_code=400, detail="Text input is required")

        analysis_result = mock_nlu_analysis(text)
        nlu_id = str(uuid.uuid4())

        nlu_store[nlu_id] = {
            "user_id": user_id,
            "text": text,
            **analysis_result
        }

        return {
            "id": nlu_id,
            **analysis_result
        }

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.get("/{nlu_id}")
async def get_nlu(nlu_id: str, id_token: str = Header(...)):
    try:
        user_id = verify_id_token(id_token)

        if nlu_id not in nlu_store:
            raise HTTPException(status_code=404, detail="NLU result not found")
        
        record = nlu_store[nlu_id]
        if record["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this result")

        return record

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.delete("/{nlu_id}")
async def delete_nlu(nlu_id: str, id_token: str = Header(...)):
    try:
        user_id = verify_id_token(id_token)

        if nlu_id not in nlu_store:
            raise HTTPException(status_code=404, detail="NLU result not found")

        record = nlu_store[nlu_id]
        if record["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this result")

        del nlu_store[nlu_id]
        return {"message": f"NLU result {nlu_id} deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
