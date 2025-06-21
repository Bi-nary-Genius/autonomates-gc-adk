import os
from typing import List, Optional
import uuid

from fastapi import APIRouter, File, UploadFile, HTTPException, Header, Form
from ..auth import verify_id_token, db
from firebase_admin import firestore
from google.cloud import vision, language_v1
import google.generativeai as genai

router = APIRouter()

# === API Key Setup ===
genai.configure(api_key=os.getenv("GOOGLE_GENAI_API_KEY"))

# === AI Clients ===
vertex_model = genai.GenerativeModel(model_name="models/gemini-1.5-flash")
vision_client = vision.ImageAnnotatorClient()
language_client = language_v1.LanguageServiceClient()


# === Vision API ===
def get_image_labels(image_bytes: bytes) -> list:
    try:
        image = vision.Image(content=image_bytes)
        response = vision_client.label_detection(image=image)
        if response.error.message:
            raise Exception(f"Vision API error: {response.error.message}")
        return [label.description for label in response.label_annotations]
    except Exception as e:
        print(f"[Vision AI] Error: {e}")
        raise Exception("Failed to get image analysis.")


# === Gemini Generative AI ===
def generate_scenario_story(prompt: str) -> str:
    full_prompt = f"Based on this memory: '{prompt}', generate an immersive 'What If' scenario story:"
    response = vertex_model.generate_content(full_prompt)
    return response.text if response.text else "[No content generated]"


# === Natural Language API ===
def analyze_mood(text: str) -> str:
    document = language_v1.Document(content=text, type_=language_v1.Document.Type.PLAIN_TEXT)
    sentiment = language_client.analyze_sentiment(request={'document': document}).document_sentiment
    score = sentiment.score

    if score >= 0.5:
        return "happy"
    elif score <= -0.3:
        return "sad"
    else:
        return "nostalgic"


# === Main Endpoint ===
@router.post("/")
async def create_scenario(
        photos: Optional[List[UploadFile]] = File(None),
        id_token: str = Header(...),
        title: str = Form(...),
        prompt: str = Form(...)
):
    try:
        user_id = verify_id_token(id_token)
        ai_labels = []
        original_filenames = []

        if photos:
            first_photo = photos[0]
            ai_labels = get_image_labels(await first_photo.read())
            original_filenames = [p.filename for p in photos]

        scenario_story = generate_scenario_story(prompt)
        mood = analyze_mood(scenario_story)

        scenario_id = str(uuid.uuid4())
        scenario_data = {
            "user_id": user_id,
            "title": title,
            "prompt": prompt,
            "scenario_generated": scenario_story,
            "mood": mood,
            "imageUrl": "https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg" if photos else "https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg",
            "original_filenames": original_filenames,
            "ai_labels": ai_labels,
            "createdAt": firestore.SERVER_TIMESTAMP,
        }

        db.collection("scenarios").document(scenario_id).set(scenario_data)

        response_data = scenario_data.copy()
        response_data["id"] = scenario_id
        response_data.pop("createdAt", None)

        return response_data

    except Exception as e:
        print(f"[Create Scenario] Error: {e}")
        raise HTTPException(status_code=500, detail="Unable to process your request.")
