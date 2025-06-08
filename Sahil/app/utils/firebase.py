import firebase_admin
from firebase_admin import credentials, firestore

# Path to the downloaded JSON file
cred = credentials.Certificate("D:\HACKATHONS\DEVPOST\Agent Development Kit Hackathon with Google Cloud\Code\whatif-backend-firebase-adminsdk-fbsvc-b781d9d5f7.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

data={
    "name": "Sahil Gupta",
    "email": "sahil@example.com"
}
# Example: Add a document
doc_ref = db.collection("users").document()
doc_ref.set(data)
print('Document:', doc_ref.id)

