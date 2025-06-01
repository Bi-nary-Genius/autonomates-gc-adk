import firebase_admin
from firebase_admin import credentials, auth

# Initialize Firebase Admin SDK
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

def verify_token(id_token):
    """
    Verify a Firebase ID token and return the user ID.
    """
    decoded_token = auth.verify_id_token(id_token)
    return decoded_token['uid']