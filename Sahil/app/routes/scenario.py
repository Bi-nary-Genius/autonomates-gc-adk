from fastapi import APIRouter, HTTPException, Header
from app.auth import verify_token
from pydantic import BaseModel

class ScenarioUpdateRequest(BaseModel):
    #We need to define the fields
    Name: str
    email: str

router = APIRouter()

@router.post("/create")#we can change the route
async def generate_scenario(id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)
        # Placeholder response
        return {"message": f"Scenario generated for user {user_id}"}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    
@router.get("/")
async def get_scenario():
    return {"message": "GET scenario placeholder"}

#For put
@router.put("/update")
async def update_scenario(payload: ScenarioUpdateRequest, id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)

        # Reference to the user's scenario document
        doc_ref = db.collection("scenarios").document(user_id)

        # Update the document
        doc_ref.set({
            "scenario_text": payload.scenario_text,
            "updated_at": datetime.utcnow()
        }, merge=True)

        return {
            "user_id": user_id,
            "message": "Scenario updated successfully",
            "scenario_text": payload.scenario_text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete("/delete")
async def delete_scenario(id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)

        # Reference to the user's scenario document
        doc_ref = db.collection("scenarios").document(user_id)

        # Delete the document
        doc_ref.delete()

        return {"message": f"Scenario deleted for user {user_id}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))