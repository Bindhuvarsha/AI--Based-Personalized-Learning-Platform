from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.tutor_routes import router as tutor_router
from app.api.ml_routes import router as ml_router
from app.api.generator_routes import router as generator_router

app = FastAPI(
    title="LearnPath AI - AI & ML Microservice",
    version="1.0.0",
    description="Microservice providing RAG Document Ingestion, Multilingual Tutor Chat, Scikit-Learn Recommendation Engine, and Adaptive Quiz Generation."
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

@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": "learnpath-ai-service",
        "provider": settings.AI_PROVIDER,
        "vector_store": settings.VECTOR_STORE_TYPE
    }

@app.get("/", tags=["System"])
async def root():
    return {
        "message": "Welcome to LearnPath AI Service",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=False)
