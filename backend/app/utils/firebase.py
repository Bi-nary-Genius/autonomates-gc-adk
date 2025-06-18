from firebase_admin import firestore, storage

# Initialize Firestore client
db = firestore.client()

# Initialize Cloud Storage client
bucket = storage.bucket()

def store_user_data(user_id, data):
    """
    Store user data in Firestore under 'users/{user_id}' document.
    """
    doc_ref = db.collection('users').document(user_id)
    doc_ref.set(data)

def upload_file(file_path, destination_blob_name):
    """
    Upload a file to Firebase Cloud Storage.
    """
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(file_path)