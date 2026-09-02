from fastapi import APIRouter
from app.models.schemas import GenerateQuestionsRequest, GenerateQuestionsResponse, GeneratedQuestion
from app.ai.openai_provider import get_ai_provider

router = APIRouter(prefix="/generate", tags=["AI Question Generator"])

@router.post("/questions", response_model=GenerateQuestionsResponse)
async def generate_questions(request: GenerateQuestionsRequest):
    ai_provider = get_ai_provider()
    raw_questions = ai_provider.generate_quiz_questions(
        topic=request.topic,
        difficulty=request.difficulty,
        count=request.count
    )

    questions = [
        GeneratedQuestion(
            questionText=q["questionText"],
            options=q["options"],
            correctOptionIndex=q["correctOptionIndex"],
            explanation=q["explanation"],
            difficulty=q["difficulty"]
        )
        for q in raw_questions
    ]

    return GenerateQuestionsResponse(
        topic=request.topic,
        difficulty=request.difficulty,
        questions=questions
    )
