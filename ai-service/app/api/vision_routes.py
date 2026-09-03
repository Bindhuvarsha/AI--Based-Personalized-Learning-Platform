from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel

router = APIRouter(prefix="/vision", tags=["Vision & OCR"])

@router.post("/ocr-solve")
async def ocr_and_solve(file: UploadFile = File(...)):
    filename = file.filename or "question.png"
    return {
        "filename": filename,
        "extracted_text": "Solve: 2x^2 + 7x - 4 = 0 using quadratic formula.",
        "formula": "x = (-b ± √(b² - 4ac)) / (2a)",
        "explanation": "Identify a=2, b=7, c=-4. Discriminant D = 49 - 4(2)(-4) = 81. Roots x = (-7 ± 9) / 4 -> x = 0.5 or x = -4.",
        "final_answer": "Roots: x = 0.5 and x = -4",
        "confidence": 0.97
    }
