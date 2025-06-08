import firebase_admin
from firebase_admin import credentials, firestore

# Path to the downloaded JSON file
cred = credentials.Certificate("D:\HACKATHONS\DEVPOST\Agent Development Kit Hackathon with Google Cloud\Code\whatif-backend-firebase-adminsdk-fbsvc-b781d9d5f7.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

# Example: Add a document
doc_ref = db.collection("users").document("user1")
doc_ref.set({
    "name": "Sahil Gupta",
    "email": "sahil@example.com"
})

# Example: Get a document
doc = doc_ref.get()
if doc.exists:
    print(f"Document data: {doc.to_dict()}")
else:
    print("No such document!")
