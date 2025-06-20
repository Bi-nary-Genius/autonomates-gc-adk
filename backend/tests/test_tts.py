import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from uuid import UUID

from main import app

client = TestClient(app)

# Replace this with a valid Firebase token for real testing
VALID_ID_TOKEN = "fake-token-for-test"

@pytest.fixture
def valid_request():
    return {
        "text": "Test audio from WhatIf"
    }

@patch("app.routes.tts.tts_client.synthesize_speech")
@patch("app.routes.tts.upload_audio_to_gcs")
@patch("app.routes.tts.verify_id_token", return_value="mock-user-id")
def test_generate_speech_success(mock_verify, mock_upload, mock_synthesize, valid_request):
    # Mock TTS response
    mock_synthesize.return_value.audio_content = b"fake audio data"
    mock_upload.return_value = "https://fake-url.com/audio.mp3"

    response = client.post(
        "/tts/generate",
        headers={"id-token": VALID_ID_TOKEN},
        json=valid_request
    )

    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "audioUrl" in data
    assert data["audioUrl"].startswith("https://")

    # Ensure valid UUID format
    UUID(data["id"])

@patch("app.routes.tts.verify_id_token", side_effect=ValueError("Invalid token"))
def test_generate_speech_unauthorized(mock_verify):
    response = client.post(
        "/tts/generate",
        headers={"id-token": "bad-token"},
        json={"text": "Should fail"}
    )
    assert response.status_code == 401

def test_generate_speech_missing_field():
    response = client.post(
        "/tts/generate",
        headers={"id-token": VALID_ID_TOKEN},
        json={}
    )
    assert response.status_code == 422
