from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SourceCitation(BaseModel):
    documentTitle: str
    pageNumber: int = 1
    chunkIndex: int = 0
    excerpt: str
    similarityScore: float = 0.0

class TutorChatRequest(BaseModel):
    userId: int
    message: str = Field(..., min_length=1)
    language: str = "english" # "english", "hindi", "kannada"
    documentFilter: Optional[str] = None

class TutorChatResponse(BaseModel):
    response: str
    language: str
    sources: List[SourceCitation] = []

class DocumentUploadResponse(BaseModel):
    documentTitle: str
    totalChunks: int
    totalPages: int
    message: str

class TopicProgressItem(BaseModel):
    topicId: int
    topicTitle: str
    masteryScore: float = 0.0
    knowledgeLevel: str = "WEAK"
    attemptsCount: int = 0
    timeSpentMinutes: int = 0

class RecommendationRequest(BaseModel):
    userId: int
    totalAttempts: int = 0
    averageScore: float = 0.0
    topicProgress: List[TopicProgressItem] = []

class RecommendationItem(BaseModel):
    type: str # "TOPIC", "QUIZ", "RESOURCE"
    targetId: int
    title: str
    reason: str
    priorityScore: float
    clusterGroup: Optional[str] = None

class RecommendationResponse(BaseModel):
    userId: int
    learnerProfile: str
    recommendations: List[RecommendationItem]

class GenerateQuestionsRequest(BaseModel):
    topic: str
    difficulty: str = "INTERMEDIATE"
    count: int = 4

class GeneratedQuestion(BaseModel):
    questionText: str
    options: List[str]
    correctOptionIndex: int
    explanation: str
    difficulty: str

class GenerateQuestionsResponse(BaseModel):
    topic: str
    difficulty: str
    questions: List[GeneratedQuestion]
