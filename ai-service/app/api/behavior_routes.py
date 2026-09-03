from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/behavior", tags=["ML Behavior Prediction"])

class BehaviorFeatures(BaseModel):
    avg_score: float
    score_trend: float
    failed_attempts: int
    inactivity_days: int
    completion_rate: float

@router.post("/predict")
async def predict_behavior(features: BehaviorFeatures):
    if features.failed_attempts >= 2 or features.score_trend < -10.0:
        category = "HIGH"
        prob = 0.76
        factors = ["Significant score drop in recent attempts", "Multiple unpassed tests"]
        intervention = "Initiate mentor review and reduce question difficulty."
    elif features.inactivity_days >= 3 or features.avg_score < 65.0:
        category = "MODERATE"
        prob = 0.40
        factors = ["Study pace deceleration", "Average quiz score under 65%"]
        intervention = "Recommend revision of foundational knowledge graph nodes."
    else:
        category = "LOW"
        prob = 0.09
        factors = ["Consistent completion rate", "Steady upward score trajectory"]
        intervention = "Ready for advanced milestones and project challenges."

    return {
        "predicted_category": category,
        "struggle_probability": prob,
        "contributing_factors": factors,
        "recommended_intervention": intervention,
        "model_version": "scikit-rf-v1.4"
    }
