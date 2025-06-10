# --- RESOLVED CODE SC ---

from fastapi import FastAPI
# Combined imports to include the new 'photo_upload' router from 'main'
from app.routes import scenario, tts, nlu, voice_cloning, photo_upload
# SC's existing import for the database client
from app.auth import db

app = FastAPI()

# routers
app.include_router(scenario.router, prefix="/scenario")
app.include_router(tts.router, prefix="/tts")
app.include_router(nlu.router, prefix="/nlu")
app.include_router(voice_cloning.router, prefix="/voice_cloning")
# Added the new router from the 'main' branch
app.include_router(photo_upload.router, prefix="/photo_upload")


@app.get("/")
async def root():
    return {"message": "Whatif Backend is running!"}


@app.get('/test-firestore')
# local test endpoint for debugging
async def test_firestore():
    try:
        collections = [col.id for col in db.collections()]
        return {"success": True, "collections": collections}
    except Exception as e:
        return {"success": False, "error": str(e)}

