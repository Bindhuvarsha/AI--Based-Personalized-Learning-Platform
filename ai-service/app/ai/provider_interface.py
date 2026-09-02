from abc import ABC, abstractmethod
from typing import List, Dict, Any

class AIProviderInterface(ABC):
    @abstractmethod
    def generate_tutor_response(
        self,
        query: str,
        retrieved_contexts: List[Dict[str, Any]],
        language: str = "english"
    ) -> str:
        """
        Generate grounded answer strictly using retrieved contexts where possible.
        """
        pass

    @abstractmethod
    def generate_quiz_questions(
        self,
        topic: str,
        difficulty: str = "INTERMEDIATE",
        count: int = 4
    ) -> List[Dict[str, Any]]:
        """
        Generate multiple-choice practice/assessment questions.
        """
        pass
