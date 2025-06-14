import firebase_admin
from firebase_admin import credentials, auth, firestore, storage
from fastapi import HTTPException

# Initialize Firebase Admin SDK
cred = credentials.Certificate("serviceAccountKey.json")

# Bingo: The projectId is automatically inferred from the service account key file.
firebase_admin.initialize_app(cred, {
    'storageBucket': 'whatif-backend-462323.appspot.com'
})

# Firestore database client
db = firestore.client()

# Firebase Storage bucket client 
bucket = storage.bucket()

def verify_id_token(id_token: str) -> str:
    """
    Verify a Firebase ID token and return the user ID.
    If token is invalid or expired, raise a 401 HTTPException.
    """
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token['uid']
    except Exception as e:
        print(f"Token verification failed: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")
