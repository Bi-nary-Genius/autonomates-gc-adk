import os
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, auth, firestore, storage
from fastapi import HTTPException

# Initialize Firebase Admin SDK using absolute path
key_path = Path(__file__).resolve().parent.parent / "serviceAccountKey.json"
cred = credentials.Certificate(str(key_path))

firebase_admin.initialize_app(cred, {
    'storageBucket': 'whatif-backend-462323.firebasestorage.app'
})

db = firestore.client()
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
