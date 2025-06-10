from fastapi import APIRouter, HTTPException, Header
from app.auth import verify_token
import uuid

router = APIRouter()

# Simulated in-memory storage for scenario data
scenario_store = {}

def generate_scenario_text(keywords: list) -> str:
    # Conditioner logic (mocked): generate scenario based on keywords
    joined = ", ".join(keywords)
    return f"What if you changed your life around {joined}? Here's how it could unfold..."

@router.post("/")
async def generate_scenario(input: dict, id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)
        keywords = input.get("keywords", [])
        if not keywords:
            raise HTTPException(status_code=400, detail="Keywords required")

        scenario_text = generate_scenario_text(keywords)
        scenario_id = str(uuid.uuid4())

        scenario_store[scenario_id] = {
            "user_id": user_id,
            "keywords": keywords,
            "scenario": scenario_text
        }

        return {
            "id": scenario_id,
            "scenario": scenario_text
        }

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.get("/{scenario_id}")
async def get_scenario(scenario_id: str, id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)

        if scenario_id not in scenario_store:
            raise HTTPException(status_code=404, detail="Scenario not found")
        
        scenario = scenario_store[scenario_id]
        if scenario["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this scenario")

        return scenario

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.delete("/{scenario_id}")
async def delete_scenario(scenario_id: str, id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)

        if scenario_id not in scenario_store:
            raise HTTPException(status_code=404, detail="Scenario not found")
        
        scenario = scenario_store[scenario_id]
        if scenario["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this scenario")

        del scenario_store[scenario_id]
        return {"message": f"Scenario {scenario_id} deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
