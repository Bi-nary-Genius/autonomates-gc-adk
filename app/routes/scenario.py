

from fastapi import APIRouter, HTTPException, Header
from app.auth import verify_id_token
import uuid # Keep this import from the 'main' branch

router = APIRouter()

# Keep the in-memory storage from the 'main' branch
scenario_store = {}

def generate_scenario_text(keywords: list) -> str:
    # Keep the scenario generation logic from 'main'
    return f"What if you changed your life around {' and '.join(keywords)}?"

@router.post('/')
async def generate_scenario(id_token: str = Header(...), keywords: list = Header(...)):
    """
    This is the complete POST endpoint from the 'main' branch.
    It generates a scenario, stores it, and returns the result.
    """
    try:
        user_id = verify_id_token(id_token)
        if not keywords:
            raise HTTPException(status_code=400, detail="Keywords cannot be empty")

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


@router.get('/{scenario_id}')
async def get_scenario(scenario_id: str, id_token: str = Header(...)):
    # Keep the GET endpoint from the 'main' branch
    verify_id_token(id_token)
    if scenario_id in scenario_store:
        return scenario_store[scenario_id]
    else:
        raise HTTPException(status_code=404, detail="Scenario not found")


@router.delete('/{item_id}')
async def delete_scenario(item_id: str, id_token: str = Header(...)):
    """
    This is the new DELETE endpoint from your branch.
    We are keeping this new functionality.
    """
    try:
        user_id = verify_id_token(id_token)
        # Placeholder logic: Delete scenario given item_id
        # In the future for our real app, we would verify the user_id owns the item_id
        # before deleting from scenario_store.
        print(f"User {user_id} requested to delete item {item_id}")
        return {"message": f"Scenario {item_id} deleted for user"}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

