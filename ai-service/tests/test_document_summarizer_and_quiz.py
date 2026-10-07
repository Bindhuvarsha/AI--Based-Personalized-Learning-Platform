import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_summarize_content_endpoint():
    payload = {
        "text": "Microservices architecture separates application components into loosely coupled services. Circuit breakers prevent cascading failures. Caching reduces database latency.",
        "documentTitle": "Distributed Systems Notes",
        "language": "english"
    }
    response = client.post("/api/v1/generate/summarize-content", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["documentTitle"] == "Distributed Systems Notes"
    assert "executiveSummary" in data
    assert len(data["keyTakeaways"]) > 0
    assert len(data["flashcards"]) > 0
    assert data["totalWords"] > 0

def test_quiz_from_content_endpoint():
    payload = {
        "text": "Circuit breakers monitor failure rates. Idempotence guarantees repeatable operations. Asynchronous brokers buffer traffic spikes.",
        "documentTitle": "Resilience Architecture",
        "count": 3,
        "difficulty": "INTERMEDIATE"
    }
    response = client.post("/api/v1/generate/quiz-from-content", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["documentTitle"] == "Resilience Architecture"
    assert len(data["questions"]) == 3
    for q in data["questions"]:
        assert "questionText" in q
        assert len(q["options"]) == 4 or len(q["options"]) == 2
        assert "correctOptionIndex" in q
        assert "explanation" in q
