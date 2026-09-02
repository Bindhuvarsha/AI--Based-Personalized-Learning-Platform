import pytest
from app.models.schemas import RecommendationRequest, TopicProgressItem
from app.ml.recommendation_model import LearnerRecommendationEngine

def test_recommendation_engine_predictions():
    engine = LearnerRecommendationEngine()
    
    # Simulate a learner with a weak topic
    request = RecommendationRequest(
        userId=42,
        totalAttempts=3,
        averageScore=48.0,
        topicProgress=[
            TopicProgressItem(
                topicId=1,
                topicTitle="Python Basics",
                masteryScore=90.0,
                knowledgeLevel="ADVANCED",
                attemptsCount=2,
                timeSpentMinutes=60
            ),
            TopicProgressItem(
                topicId=2,
                topicTitle="Machine Learning",
                masteryScore=38.0,
                knowledgeLevel="WEAK",
                attemptsCount=1,
                timeSpentMinutes=20
            )
        ]
    )

    response = engine.predict_recommendations(request)
    assert response.userId == 42
    assert response.learnerProfile in ["Remedial / Diligent", "Balanced Achiever", "Accelerated Learner"]
    assert len(response.recommendations) >= 2
    
    # Check that the weak topic is flagged for review
    types = [r.type for r in response.recommendations]
    assert "RESOURCE" in types or "QUIZ" in types
    
    # Check that recommendation reasons are populated
    for r in response.recommendations:
        assert len(r.title) > 0
        assert len(r.reason) > 0
        assert 0.0 <= r.priorityScore <= 1.0
