from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/resume", tags=["Resume NLP & Gap Analysis"])

class GapAnalysisRequest(BaseModel):
    extracted_skills: List[str]
    target_role: str

@router.post("/extract")
async def extract_resume_skills(file: UploadFile = File(...)):
    return {
        "filename": file.filename or "resume.pdf",
        "extracted_skills": [
            {"skill": "Java", "category": "Languages", "evidence": "2 years Java microservices"},
            {"skill": "Spring Boot", "category": "Frameworks", "evidence": "Built REST APIs"},
            {"skill": "SQL", "category": "Databases", "evidence": "PostgreSQL schema design"},
            {"skill": "Docker", "category": "DevOps", "evidence": "Containerized applications"}
        ]
    }

@router.post("/gap-analysis")
async def analyze_skill_gap(request: GapAnalysisRequest):
    return {
        "match_percentage": 68.0,
        "matched": ["Java", "Spring Boot", "SQL"],
        "partial": ["Docker"],
        "missing": ["Kafka", "Redis", "Kubernetes"],
        "recommendations": [
            {"title": "Complete Kafka Module", "type": "COURSE"},
            {"title": "Build Distributed Caching Project", "type": "PROJECT"}
        ]
    }
