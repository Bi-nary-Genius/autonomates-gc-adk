# SC: Added Form to handle form data from the frontend
from fastapi import APIRouter, File, UploadFile, HTTPException, Header, Form
from app.auth import verify_id_token
import uuid
import time  # SC: Added time to simulate AI processing delay

router = APIRouter()

# SC: Renamed from photo_store to scenario_store for clarity
scenario_store = {}


# SC: This function is no longer needed for the new scenario creation logic
# def mock_vision_classify(image_bytes: bytes):
#     # Fake result
#     return ["beach", "sunset", "vacation"]

@router.post("/")
# SC: Renamed function and added title and keywords from the form & changed the name of the file parameter
async def create_scenario_with_photo(
        photo: UploadFile = File(...),
        id_token: str = Header(...),
        title: str = Form(...),
        keywords: str = Form(...)
):
    try:
        user_id = verify_id_token(id_token)

        # SC: New logic to create a mock scenario instead of classifying the image
        print(f"User '{user_id}' is creating a scenario titled '{title}' with photo '{photo.filename}'.")

        # SC: Simulate a delay as if AI is working
        time.sleep(2)

        # SC: Create a fake AI response based on keywords
        mock_ai_description = f"This is a mock AI-generated scenario based on the keywords: {keywords}."
        scenario_id = str(uuid.uuid4())

        # SC: Store the new scenario data structure
        scenario_store[scenario_id] = {
            "user_id": user_id,
            "title": title,
            "keywords": keywords,
            "description": mock_ai_description,
            "imageUrl": "https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            # Placeholder image
            "original_filename": photo.filename
        }

        # SC: Return the data structure the frontend is now expecting
        return {
            "id": scenario_id,
            "title": title,
            "description": mock_ai_description,
            "imageUrl": scenario_store[scenario_id]["imageUrl"]
        }

    except Exception as e:
        # SC: Updated error handling to be more generic for this endpoint
        print(f"Error in create_scenario_with_photo endpoint: {e}")
        raise HTTPException(status_code=400, detail=f"Could not process request: {e}")


# SC: Renamed function for clarity
@router.get("/{scenario_id}")
async def get_scenario_result(scenario_id: str, id_token: str = Header(...)):
    try:
        user_id = verify_id_token(id_token)

        if scenario_id not in scenario_store:
            raise HTTPException(status_code=404, detail="Scenario result not found")

        record = scenario_store[scenario_id]
        if record["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this scenario")

        return record

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


# SC: Renamed function for clarity
@router.delete("/{scenario_id}")
async def delete_scenario(scenario_id: str, id_token: str = Header(...)):
    try:
        user_id = verify_id_token(id_token)

        if scenario_id not in scenario_store:
            raise HTTPException(status_code=404, detail="Scenario not found")

        record = scenario_store[scenario_id]
        if record["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this scenario")

        del scenario_store[scenario_id]
        return {"message": f"Scenario {scenario_id} deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
