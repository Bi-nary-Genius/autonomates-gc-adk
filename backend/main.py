import os
from pathlib import Path

# === Set up GOOGLE_APPLICATION_CREDENTIALS globally ===
key_path = Path(__file__).resolve().parent / "serviceAccountKey.json"

if "GOOGLE_APPLICATION_CREDENTIALS" not in os.environ:
    if key_path.exists():
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(key_path)
    else:
        print(
            f"⚠️ WARNING: serviceAccountKey.json not found at {key_path}.\n"
            "Set GOOGLE_APPLICATION_CREDENTIALS manually or make sure the key file is in the backend directory."
        )

# DEBUG: confirm it was set
print("👀 GOOGLE_APPLICATION_CREDENTIALS set to:", os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"))

# ✅ Only now do we import routes
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .app.routes import scenario, tts, nlu, voice_cloning, photo_upload, stig_agent
from .app.auth import db


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
app.include_router(stig_agent.router, prefix="/stig")

# === Root Test ===
@app.get("/")
async def root():
    return {"message": "Whatif Backend is running!"}


@app.get("/test-firestore")
async def test_firestore():
    try:
        collections = [col.id async for col in db.collections()]
        return {"success": True, "collections": collections}
    except Exception as e:
        print(f"[Firestore Test] Error: {e}")
        return {"success": False, "error": str(e)}
