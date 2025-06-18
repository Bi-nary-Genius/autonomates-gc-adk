from fastapi import APIRouter, HTTPException, Header
from app.auth import verify_id_token, db
from google.cloud import language_v1
import uuid

router = APIRouter()

# Initialize Natural Language API client
language_client = language_v1.LanguageServiceClient()

# Real NLU analysis
def real_nlu_analysis(text: str):
    try:
        document = language_v1.Document(content=text, type_=language_v1.Document.Type.PLAIN_TEXT)
        sentiment = language_client.analyze_sentiment(request={'document': document}).document_sentiment
        score = sentiment.score

        if score >= 0.5:
            emotion = "happy"
        elif score <= -0.3:
            emotion = "sad"
        else:
            emotion = "neutral"

        return {
            "sentiment_score": score,
            "emotion": emotion
        }
    except Exception as e:
        print(f"NLU analysis error: {e}")
        raise Exception("Failed to analyze sentiment")

@router.post("/")
async def analyze_emotion(input: dict, id_token: str = Header(...)):
    try:
        user_id = verify_id_token(id_token)
        text = input.get("text", "").strip()
        if not text:
            raise HTTPException(status_code=400, detail="Text input is required")

        analysis_result = real_nlu_analysis(text)
        nlu_id = str(uuid.uuid4())

        # Save result to Firestore
        nlu_data = {
            "user_id": user_id,
            "text": text,
            **analysis_result
        }
        db.collection("nlu_results").document(nlu_id).set(nlu_data)

        response_data = {
            "id": nlu_id,
            **analysis_result
        }
        return response_data

    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Analyze emotion error: {e}")
        raise HTTPException(status_code=400, detail="Could not process request.")
