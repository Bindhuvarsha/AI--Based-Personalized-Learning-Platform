import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["version"] == "2.0.0"
    assert "rag-tutor" in data["features"]
    assert "voice-stt-tts" in data["features"]
    assert "coding-sandbox" in data["features"]

def test_voice_synthesize_endpoint():
    payload = {
        "text": "Hello, welcome to LearnPath AI!",
        "language": "ENGLISH"
    }
    response = client.post("/api/v1/voice/synthesize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "audioData" in data or "audioUrl" in data or "durationSeconds" in data

def test_behavior_struggle_predictor():
    payload = {
        "userId": 1,
        "recentQuizAverage": 45.0,
        "consecutiveFails": 3,
        "averageTimePerQuestion": 95.0,
        "missedDeadlines": 2,
        "daysSinceLastActive": 4
    }
    response = client.post("/api/v1/behavior/predict-struggle", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "struggleProbability" in data
    assert data["riskCategory"] in ["LOW", "MODERATE", "HIGH", "CRITICAL"]
    assert len(data["interventions"]) > 0

def test_coding_sandbox_execute():
    payload = {
        "language": "PYTHON",
        "code": "def solution():\n    return 'Hello World'\nprint(solution())",
        "testCases": [{"input": "", "expectedOutput": "Hello World"}]
    }
    response = client.post("/api/v1/coding/execute", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "stdout" in data or "testsPassed" in data or "review" in data

def test_resume_extract_and_match():
    payload = {
        "resumeText": "Experienced with Java, Spring Boot, PostgreSQL, Docker, Git. Built REST APIs.",
        "targetRole": "Senior Backend Java Engineer"
    }
    response = client.post("/api/v1/resume/extract-and-match", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "matchPercentage" in data
    assert "matchedSkills" in data
    assert "missingSkills" in data
