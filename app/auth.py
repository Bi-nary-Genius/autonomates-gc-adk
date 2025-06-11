


import firebase_admin
# Added firestore to make it available for the db client
from firebase_admin import credentials, auth, firestore
# Added HTTPException from the 'main' branch for proper API error responses
from fastapi import HTTPException

# Initialize Firebase Admin SDK
cred = credentials.Certificate("serviceAccountKey.json")

# Bingo:The projectId is automatically inferred from the service account key file.
firebase_admin.initialize_app(cred)

# Create the Firestore database client instance
db = firestore.client()


def verify_id_token(id_token: str) -> str:
    """
    Verify a Firebase ID token and return the user ID.
    If token is invalid or expired, raise a 401 HTTPException.
    """

    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token['uid']
    except Exception as e:
        # This print is helpful for server-side debugging to see why a token failed.
        print(f"Token verification failed: {str(e)}")
        # This raises a proper HTTP error that FastAPI will send to the user.
        raise HTTPException(status_code=401, detail="Invalid or expired token")

