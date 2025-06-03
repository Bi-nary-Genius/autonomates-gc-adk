from fastapi import FastAPI
from app.routes import scenario, tts, nlu, voice_cloning

app = FastAPI()

app.include_router(scenario.router, prefix="/scenario")
app.include_router(tts.router, prefix="/tts")
app.include_router(nlu.router, prefix="/nlu")
app.include_router(voice_cloning.router, prefix="/voice")
@app.get("/")
async def root():
    return {"message": "WhatIf Backend is running!"}