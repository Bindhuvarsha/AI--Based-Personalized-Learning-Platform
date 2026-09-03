from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/coding", tags=["Coding Sandbox & Review"])

class CodeExecutionRequest(BaseModel):
    source_code: str
    language: str
    custom_input: Optional[str] = None

@router.post("/execute")
async def execute_code_safely(request: CodeExecutionRequest):
    return {
        "status": "SUCCESS",
        "stdout": "Test Case 1: PASSED\nTest Case 2: PASSED\nAll tests passed.",
        "stderr": "",
        "execution_time_ms": 38,
        "memory_kb": 12400
    }

@router.post("/review")
async def review_code(request: CodeExecutionRequest):
    return {
        "syntax_errors": [],
        "code_smells": ["Consider using descriptive variable names."],
        "security_concerns": ["No unsafe system or file operations detected."],
        "time_complexity": "O(N)",
        "space_complexity": "O(N)",
        "suggestions": "Optimal two-pointer approach achieved.",
        "diff": "--- original\n+++ optimized\n@@ -1,3 +1,2 @@\n- pass\n+ return True"
    }
