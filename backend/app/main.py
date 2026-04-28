# Firebase/Google credentials disabled — backend runs without serviceAccountKey.json

from dotenv import load_dotenv
from pathlib import Path
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import scenario, tts, nlu, voice_cloning, photo_upload
# === FastAPI Setup ===
app = FastAPI()

# CORS Configuration
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Include All API Routes ===
app.include_router(scenario.router, prefix="/scenario")
app.include_router(tts.router, prefix="/tts")
app.include_router(nlu.router, prefix="/nlu")
app.include_router(voice_cloning.router, prefix="/voice_cloning")
app.include_router(photo_upload.router, prefix="/photo_upload")

# === Root Test ===
@app.get("/")
async def root():
    return {"message": "Whatif Backend is running!"}


@app.get("/test-firestore")
async def test_firestore():
    return {"success": False, "error": "Firebase disabled"}
