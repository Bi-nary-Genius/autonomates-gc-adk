from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import scenario, tts, nlu, voice_cloning, photo_upload, speech_to_text
from app.auth import db

app = FastAPI()

# Configure CORS to allow requests from the frontend
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# updated all routers without a trailing slash in the prefix bc of 405 method not allowed error
app.include_router(scenario.router, prefix="/scenario")
app.include_router(tts.router, prefix="/tts")
app.include_router(nlu.router, prefix="/nlu")
app.include_router(voice_cloning.router, prefix="/voice_cloning")
app.include_router(photo_upload.router, prefix="/photo_upload") # No trailing slash
app.include_router(speech_to_text.router, prefix="/speech-to-text", tags=["speech-to-text"])


@app.get("/")
async def root():
    return {"message": "Whatif Backend is running!"}

@app.get('/test-firestore')
async def test_firestore():
    try:
        collections = [col.id for col in db.collections()]
        return {"success": True, "collections": collections}
    except Exception as e:
        return {"success": False, "error": str(e)}
