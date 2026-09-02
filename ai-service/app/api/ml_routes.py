from fastapi import APIRouter
from app.models.schemas import RecommendationRequest, RecommendationResponse
from app.ml.recommendation_model import recommendation_engine

router = APIRouter(tags=["ML Recommendation Engine"])

@router.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    return recommendation_engine.predict_recommendations(request)
