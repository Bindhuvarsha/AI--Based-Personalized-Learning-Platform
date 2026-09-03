from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/voice", tags=["Voice AI"])

class SynthesizeRequest(BaseModel):
    text: str
    language: Optional[str] = "ENGLISH"

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...), language: str = Form("ENGLISH")):
    filename = file.filename or ""
    # Deterministic speech-to-text fallback
    if "question" in filename.lower():
        text = "Can you explain how Dijkstra's algorithm finds the shortest path?"
    else:
        text = "How does Spring Boot handle transaction rollbacks with @Transactional?"
    return {
        "transcript": text,
        "language": language,
        "confidence": 0.96,
        "duration_seconds": 4.5
    }

@router.post("/synthesize")
async def synthesize_speech(request: SynthesizeRequest):
    return {
        "status": "synthesized",
        "audio_url": "/api/voice/audio/sample-ai-response.wav",
        "language": request.language,
        "duration_seconds": 6.2
    }
