from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.tutor_routes import router as tutor_router
from app.api.ml_routes import router as ml_router
from app.api.generator_routes import router as generator_router
from app.api.voice_routes import router as voice_router
from app.api.vision_routes import router as vision_router
from app.api.behavior_routes import router as behavior_router
from app.api.coding_routes import router as coding_router
from app.api.resume_routes import router as resume_router

app = FastAPI(
    title="LearnPath AI - AI & ML Microservice",
    version="2.0.0",
    description="Microservice providing RAG Document Ingestion, Multilingual Voice Tutor, OCR Image Solver, ML Struggle Predictor, Code Sandbox, and Resume Analyzer."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tutor_router, prefix="/api/v1")
app.include_router(ml_router, prefix="/api/v1")
app.include_router(generator_router, prefix="/api/v1")
app.include_router(voice_router, prefix="/api/v1")
app.include_router(vision_router, prefix="/api/v1")
app.include_router(behavior_router, prefix="/api/v1")
app.include_router(coding_router, prefix="/api/v1")
app.include_router(resume_router, prefix="/api/v1")

@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": "learnpath-ai-service",
        "version": "2.0.0",
        "features": [
            "rag-tutor", "voice-stt-tts", "vision-ocr", "ml-behavior-prediction",
            "coding-sandbox", "resume-skill-gap"
        ]
    }

@app.get("/", tags=["System"])
async def root():
    return {
        "message": "Welcome to LearnPath AI Service 2.0",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=False)
