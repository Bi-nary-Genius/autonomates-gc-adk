from fastapi import APIRouter, HTTPException, Header
from app.auth import verify_token
from pydantic import BaseModel

class UpdateNLURequest(BaseModel):
    text: str
    analysis: str

router = APIRouter()

#Creating/sending data
@router.post("/create")#we can change the route
async def analyze_emotion(id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)
        
        return {"message": f"NLU analysis done for user {user_id}"}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

#Getting data from database (Firebase)    
@router.get("/")
async def get_nlu():
    return {"message": "GET NLU placeholder"}

#Editing data in database
@router.put("/update")
async def update_nlu(payload: UpdateNLURequest, id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)

        # For example, we may delete this 
        updated_data = {
            "user_id": user_id,
            "text": payload.text,
            "analysis": payload.analysis,
            "message": "NLU data updated successfully"
        }

        return updated_data

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

#delete request

@router.delete("/delete")
async def delete_nlu(id_token: str = Header(...)):
    try:
        user_id = verify_token(id_token)

        #We need to change this 
        # For example:
        # firebase_db.child("nlu_data").child(user_id).remove()

        return {"message": f"NLU data deleted for user {user_id}"}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))