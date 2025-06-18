from fastapi import APIRouter, Query
import json
import os

router = APIRouter()

# Define the path to the stigs.json file
DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'stigs.json')

# Load the STIG data once when the app starts
with open(DATA_PATH, 'r') as f:
    stig_data = json.load(f)

@router.get("/explain_stig")
async def explain_stig(stig_id: str = Query(..., example="V-71991")):
    """Return plain-English explanation and example fix for a STIG ID"""
    result = stig_data.get(stig_id.upper())
    if not result:
        return {"error": f"STIG ID '{stig_id}' not found in database."}
    return result
