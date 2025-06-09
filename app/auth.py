import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException

# Initialize Firebase Admin SDK
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

def verify_token(id_token: str) -> str:
    """
    Verify a Firebase ID token and return the user ID.
    Raise HTTPException if token is invalid or expired.
    """
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token['uid']
    except Exception as e:
        # Optional: print error for debugging
        print("Token verification failed:", str(e))
        raise HTTPException(status_code=401, detail="Invalid or expired Firebase ID token")

# Uncomment for mock mode testing without real Firebase verification
# return "mock_user_id"
