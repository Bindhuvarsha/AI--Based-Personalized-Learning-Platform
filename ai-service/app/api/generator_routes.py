from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.models.schemas import (
    GenerateQuestionsRequest, GenerateQuestionsResponse, GeneratedQuestion,
    SummarizeDocumentRequest, SummarizeDocumentResponse, FlashcardItem,
    QuizFromDocumentRequest, QuizFromDocumentResponse
)
from app.ai.openai_provider import get_ai_provider
from app.rag.document_parser import DocumentParser

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

@router.post("/summarize-content", response_model=SummarizeDocumentResponse)
async def summarize_content_endpoint(request: SummarizeDocumentRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Content text cannot be empty.")

    ai_provider = get_ai_provider()
    result = ai_provider.summarize_content(
        text=request.text,
        document_title=request.documentTitle or "Study Notes",
        language=request.language or "english"
    )

    return SummarizeDocumentResponse(
        documentTitle=result["documentTitle"],
        executiveSummary=result["executiveSummary"],
        keyTakeaways=result["keyTakeaways"],
        flashcards=[FlashcardItem(**fc) for fc in result["flashcards"]],
        estimatedReadTimeMinutes=result["estimatedReadTimeMinutes"],
        totalWords=result["totalWords"]
    )

@router.post("/summarize-file", response_model=SummarizeDocumentResponse)
async def summarize_file_endpoint(
    file: UploadFile = File(...),
    language: str = Form("english")
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded")

    try:
        pages = DocumentParser.parse_file(contents, file.filename)
        combined_text = "\n\n".join([p["text"] for p in pages if p.get("text")])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse document: {str(e)}")

    ai_provider = get_ai_provider()
    result = ai_provider.summarize_content(
        text=combined_text,
        document_title=file.filename,
        language=language
    )

    return SummarizeDocumentResponse(
        documentTitle=result["documentTitle"],
        executiveSummary=result["executiveSummary"],
        keyTakeaways=result["keyTakeaways"],
        flashcards=[FlashcardItem(**fc) for fc in result["flashcards"]],
        estimatedReadTimeMinutes=result["estimatedReadTimeMinutes"],
        totalWords=result["totalWords"]
    )

@router.post("/quiz-from-content", response_model=QuizFromDocumentResponse)
async def quiz_from_content_endpoint(request: QuizFromDocumentRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Content text cannot be empty.")

    ai_provider = get_ai_provider()
    raw_questions = ai_provider.generate_quiz_from_content(
        text=request.text,
        count=request.count,
        difficulty=request.difficulty
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

    return QuizFromDocumentResponse(
        documentTitle=request.documentTitle or "Study Notes",
        difficulty=request.difficulty,
        questions=questions
    )

@router.post("/quiz-from-file", response_model=QuizFromDocumentResponse)
async def quiz_from_file_endpoint(
    file: UploadFile = File(...),
    count: int = Form(5),
    difficulty: str = Form("INTERMEDIATE")
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded")

    try:
        pages = DocumentParser.parse_file(contents, file.filename)
        combined_text = "\n\n".join([p["text"] for p in pages if p.get("text")])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse document: {str(e)}")

    ai_provider = get_ai_provider()
    raw_questions = ai_provider.generate_quiz_from_content(
        text=combined_text,
        count=count,
        difficulty=difficulty
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

    return QuizFromDocumentResponse(
        documentTitle=file.filename,
        difficulty=difficulty,
        questions=questions
    )
