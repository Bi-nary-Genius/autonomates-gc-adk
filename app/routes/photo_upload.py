from fastapi import APIRouter, File, UploadFile, HTTPException, Header, Form
from app.auth import verify_id_token, db, bucket
from firebase_admin import firestore
import uuid
from typing import List, Optional
from google.cloud.vision_v1 import ImageAnnotatorClient, Image
from pydantic import BaseModel

router = APIRouter(prefix="/photo_upload")

# Initialize Vision AI client
vision_client = ImageAnnotatorClient()

# Helper: Upload image to Firebase Storage
def upload_to_storage(file: UploadFile, user_id: str) -> str:
    try:
        blob_path = f"users/{user_id}/photos/{uuid.uuid4()}-{file.filename}"
        blob = bucket.blob(blob_path)
        blob.upload_from_file(file.file, content_type=file.content_type)
        blob.make_public()
        return blob.public_url
    except Exception as e:
        print(f"Storage upload error: {e}")
        raise Exception("Failed to upload image to storage")

# Helper: Vision AI label detection
def get_image_labels(image_bytes: bytes) -> list:
    try:
        image = Image(content=image_bytes)
        response = vision_client.label_detection(image=image)
        if response.error.message:
            raise Exception(f"Vision API error: {response.error.message}")
        return [label.description for label in response.label_annotations]
    except Exception as e:
        print(f"Vision AI error: {e}")
        raise Exception("Failed to analyze image")

# CREATE
@router.post("/")
async def create_scenario(
    photos: Optional[List[UploadFile]] = File(None),
    id_token: str = Header(...),
    title: str = Form(...),
    prompt: str = Form(...)
):
    try:
        user_id = verify_id_token(id_token)
        image_urls = []
        ai_labels = []
        original_filenames = []

        if photos:
            for photo in photos:
                content = await photo.read()
                labels = get_image_labels(content)
                ai_labels.extend(labels)
                photo.file.seek(0)  # Reset file pointer for storage upload
                url = upload_to_storage(photo, user_id)
                image_urls.append(url)
                original_filenames.append(photo.filename)

        scenario_id = str(uuid.uuid4())
        scenario_data = {
            "user_id": user_id,
            "title": title,
            "prompt": prompt,
            "imageUrls": image_urls,
            "original_filenames": original_filenames,
            "ai_labels": list(set(ai_labels)),  # 去重
            "createdAt": firestore.SERVER_TIMESTAMP,
        }
        db.collection("scenarios").document(scenario_id).set(scenario_data)

        response_data = scenario_data.copy()
        response_data["id"] = scenario_id
        response_data.pop("createdAt", None)

        return response_data

    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        print(f"Create scenario error: {e}")
        raise HTTPException(status_code=400, detail="Could not process request.")

# READ
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
        scenarios = [{**doc.to_dict(), "id": doc.id} for doc in docs]
        return scenarios

    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        print(f"Fetch scenarios error: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch scenarios")

# UPDATE
class ScenarioUpdate(BaseModel):
    title: str
    prompt: str

@router.put("/{scenario_id}")
async def update_scenario(scenario_id: str, update_data: ScenarioUpdate, id_token: str = Header(...)):
    try:
        user_id = verify_id_token(id_token)
        doc_ref = db.collection("scenarios").document(scenario_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Scenario not found")

        if doc.to_dict().get("user_id") != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

        doc_ref.update({
            "title": update_data.title,
            "prompt": update_data.prompt
        })

        return {"message": f"Scenario {scenario_id} updated successfully"}

    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        print(f"Update scenario error: {e}")
        raise HTTPException(status_code=500, detail="Could not update scenario")

# DELETE
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

    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        print(f"Delete scenario error: {e}")
        raise HTTPException(status_code=500, detail="Could not delete scenario")
