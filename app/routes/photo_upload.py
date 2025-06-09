from fastapi import APIRouter, File, UploadFile, HTTPException, Header, Depends
from app.auth import verify_token
import uuid

router = APIRouter(prefix="/photo_upload")

# Simulated in-memory store for photo analysis results
photo_store = {}

# Mocked call to Vertex AI Vision (replace with actual client logic later)
def mock_vision_classify(image_bytes: bytes):
    # Fake result
    return ["beach", "sunset", "vacation"]

@router.post("/")
async def upload_photo(
    file: UploadFile = File(...),
    id_token: str = Header(...)
):
    try:
        user_id = verify_token(id_token)
        contents = await file.read()
        labels = mock_vision_classify(contents)

        photo_id = str(uuid.uuid4())
        photo_store[photo_id] = {
            "user_id": user_id,
            "filename": file.filename,
            "labels": labels
        }

        return {
            "id": photo_id,
            "filename": file.filename,
            "labels": labels
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{photo_id}")
async def get_photo_result(photo_id: str, id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)

        if photo_id not in photo_store:
            raise HTTPException(status_code=404, detail="Photo result not found")

        record = photo_store[photo_id]
        if record["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this photo")

        return record

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.delete("/{photo_id}")
async def delete_photo(photo_id: str, id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)

        if photo_id not in photo_store:
            raise HTTPException(status_code=404, detail="Photo not found")

        record = photo_store[photo_id]
        if record["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this photo")

        del photo_store[photo_id]
        return {"message": f"Photo {photo_id} deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
