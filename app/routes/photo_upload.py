from fastapi import APIRouter, File, UploadFile, HTTPException, Header, Form
from app.auth import verify_id_token, db       # firestore comes from firebase_admin
from firebase_admin import firestore           # import firestore directly
import uuid
from typing import List, Optional
from google.cloud.vision import ImageAnnotatorClient, Image

router = APIRouter(prefix="/photo_upload")

# -------------- Vision helper --------------
def get_image_labels(image_bytes: bytes) -> list:
    client = ImageAnnotatorClient()
    image = Image(content=image_bytes)
    response = client.label_detection(image=image)
    if response.error.message:
        raise Exception(f"Vision API error: {response.error.message}")
    return [label.description for label in response.label_annotations]

# -------------- CREATE ---------------------
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
            print(f"User {user_id} uploaded {len(photos)} photo(s).")
        else:
            print(f"User {user_id} created a text-only scenario.")

        scenario_id = str(uuid.uuid4())
        scenario_data = {
            "user_id": user_id,
            "title": title,
            "prompt": prompt,
            "imageUrl": "https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg"
                        if photos else
                        "https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg",
            "original_filenames": original_filenames,
            "ai_labels": ai_labels,
            "createdAt": firestore.SERVER_TIMESTAMP,
        }
        db.collection("scenarios").document(scenario_id).set(scenario_data)

        return {
            "id": scenario_id,
            "title": title,
            "description": (
                f"AI tags: {', '.join(ai_labels)}"
                if ai_labels
                else f"Scenario based on prompt: \"{prompt[:50]}...\""
            ),
            "imageUrl": scenario_data["imageUrl"],
            "labels": ai_labels,
        }

    except Exception as e:
        print(f"Create scenario error: {e}")
        raise HTTPException(status_code=400, detail=f"Could not process request: {e}")

# -------------- READ -----------------------
@router.get("/")
async def get_scenarios(id_token: str = Header(...)):
    try:
        user_id = verify_id_token(id_token)
        docs = (
            db.collection("scenarios")
            .where("user_id", "==", user_id)
            .order_by("createdAt", direction=firestore.Query.DESCENDING)
            .stream()
        )
        scenarios = [{**d.to_dict(), "id": d.id} for d in docs]
        return scenarios
    except Exception as e:
        print(f"Fetch scenarios error: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch scenarios")

# -------------- DELETE ---------------------
@router.delete("/{scenario_id}")
async def delete_scenario(scenario_id: str, id_token: str = Header(...)):
    try:
        user_id = verify_id_token(id_token)
        doc_ref = db.collection("scenarios").document(scenario_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Scenario not found")
        if doc.to_dict().get("user_id") != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

        doc_ref.delete()
        return {"message": f"Scenario {scenario_id} deleted successfully"}
    except Exception as e:
        print(f"Delete scenario error: {e}")
        raise HTTPException(status_code=500, detail=f"Could not delete scenario: {e}")
