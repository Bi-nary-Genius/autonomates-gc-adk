from fastapi import APIRouter, HTTPException, Header
from app.auth import verify_id_token, db
import uuid
import google.generativeai as genai

router = APIRouter()

# Initialize Gemini with your real API key
genai.configure(api_key="AIzaSyB_BrOTUK-dAo5eEu3JNy2-MGjp-nzc7tg")
model = genai.GenerativeModel("gemini-pro")

# Voice cloning logic (simplified version)
def generate_voice_clone_text(prompt: str) -> str:
    try:
        full_prompt = (
            f"You are a voice cloning system. Take the following text and transform it into an expressive, natural spoken style:\n\n{prompt}"
        )
        response = model.generate_content(full_prompt)
        return response.text
    except Exception as e:
        print(f"Gemini error: {e}")
        raise Exception("Failed to generate voice clone text")

@router.post("/")
async def voice_clone(input: dict, id_token: str = Header(...)):
    try:
        user_id = verify_id_token(id_token)
        prompt = input.get("prompt", "").strip()

        if not prompt:
            raise HTTPException(status_code=400, detail="Prompt is required.")

        cloned_text = generate_voice_clone_text(prompt)
        voice_clone_id = str(uuid.uuid4())

        record = {
            "user_id": user_id,
            "original_prompt": prompt,
            "cloned_text": cloned_text
        }
        db.collection("voice_clones").document(voice_clone_id).set(record)

        return {
            "id": voice_clone_id,
            "cloned_text": cloned_text
        }

    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        print(f"Voice cloning error: {e}")
        raise HTTPException(status_code=400, detail="Could not process voice cloning request.")
