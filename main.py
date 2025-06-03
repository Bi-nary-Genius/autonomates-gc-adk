from fastapi import FastAPI
from app.routes import scenario
app = FastAPI()

app.include_router(scenario.router, prefix="/scenario")

@app.get("/")
async def root():
    return {"message": "WhatIf Backend is running!"}