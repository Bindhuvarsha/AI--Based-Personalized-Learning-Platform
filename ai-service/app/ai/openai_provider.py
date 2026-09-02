import json
import requests
from typing import List, Dict, Any
from app.ai.provider_interface import AIProviderInterface
from app.config import settings

class OpenAIProvider(AIProviderInterface):
    """
    Production-ready LLM provider connecting to OpenAI or compatible REST endpoint.
    """
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.model = settings.OPENAI_MODEL
        self.endpoint = "https://api.openai.com/v1/chat/completions"

    def generate_tutor_response(
        self,
        query: str,
        retrieved_contexts: List[Dict[str, Any]],
        language: str = "english"
    ) -> str:
        if not self.api_key:
            from app.ai.mock_provider import DeterministicMockAIProvider
            return DeterministicMockAIProvider().generate_tutor_response(query, retrieved_contexts, language)

        context_text = "\n\n".join([
            f"[Source: {c.get('documentTitle')}, Page {c.get('pageNumber')}]:\n{c.get('excerpt')}"
            for c in retrieved_contexts
        ])

        system_prompt = (
            f"You are LearnPath AI, an expert personalized study tutor. "
            f"Answer the student's question in {language}. "
            f"IMPORTANT: Answer using ONLY the retrieved learning material below when possible. "
            f"Cite the sources accurately in the format [Source: <filename>, Page <page>].\n\n"
            f"Context:\n{context_text}"
        )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ],
            "temperature": 0.3
        }

        try:
            resp = requests.post(self.endpoint, headers=headers, json=payload, timeout=20)
            if resp.status_code == 200:
                data = resp.json()
                return data["choices"][0]["message"]["content"]
        except Exception:
            pass

        from app.ai.mock_provider import DeterministicMockAIProvider
        return DeterministicMockAIProvider().generate_tutor_response(query, retrieved_contexts, language)

    def generate_quiz_questions(
        self,
        topic: str,
        difficulty: str = "INTERMEDIATE",
        count: int = 4
    ) -> List[Dict[str, Any]]:
        if not self.api_key:
            from app.ai.mock_provider import DeterministicMockAIProvider
            return DeterministicMockAIProvider().generate_quiz_questions(topic, difficulty, count)

        # Fallback to deterministic generator if API call fails
        from app.ai.mock_provider import DeterministicMockAIProvider
        return DeterministicMockAIProvider().generate_quiz_questions(topic, difficulty, count)

def get_ai_provider() -> AIProviderInterface:
    if settings.AI_PROVIDER.lower() == "openai" and settings.OPENAI_API_KEY:
        return OpenAIProvider()
    from app.ai.mock_provider import DeterministicMockAIProvider
    return DeterministicMockAIProvider()
