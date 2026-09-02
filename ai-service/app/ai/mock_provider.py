from typing import List, Dict, Any
from app.ai.provider_interface import AIProviderInterface

class DeterministicMockAIProvider(AIProviderInterface):
    """
    Deterministic Mock AI Provider for local, zero-cost, offline execution.
    Produces high-quality contextual study answers and domain-grounded questions.
    """

    def generate_tutor_response(
        self,
        query: str,
        retrieved_contexts: List[Dict[str, Any]],
        language: str = "english"
    ) -> str:
        lang_lower = language.lower()

        # Build citations string
        citations_str = ""
        if retrieved_contexts:
            first_c = retrieved_contexts[0]
            citations_str = f"[Source: {first_c.get('documentTitle', 'StudyNotes.pdf')}, Page {first_c.get('pageNumber', 1)}]"

        if lang_lower == "hindi":
            if retrieved_contexts:
                return (
                    f"नमस्ते! आपके अध्ययन सामग्री के आधार पर, यहाँ आपके प्रश्न '{query}' का उत्तर है:\n\n"
                    f"सामग्री में स्पष्ट किया गया है कि इस विषय की मुख्य अवधारणाएँ मौलिक सिद्धांतों पर आधारित हैं। "
                    f"विशिष्ट रूप से, समस्याओं को छोटे भागों में तोड़कर और व्यवस्थित अभ्यास करके इसे आसानी से सीखा जा सकता है।\n\n"
                    f"संदर्भ: {citations_str}\n\n"
                    f"क्या आप इस विषय पर अभ्यास क्विज़ हल करना चाहते हैं?"
                )
            else:
                return (
                    f"नमस्ते! '{query}' के संबंध में:\n\n"
                    f"यह एक महत्वपूर्ण अवधारणा है। चूंकि कोई विशिष्ट अध्ययन दस्तावेज़ अपलोड नहीं किया गया है, "
                    f"इसलिए कृपया अपना पीडीएफ या नोट्स अपलोड करें ताकि मैं सीधे आपकी अध्ययन सामग्री से उत्तर दे सकूँ।"
                )

        elif lang_lower == "kannada":
            if retrieved_contexts:
                return (
                    f"ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳ ಆಧಾರದ ಮೇಲೆ, '{query}' ಗೆ ಸಂಬಂಧಿಸಿದ ಉತ್ತರ ಇಲ್ಲಿದೆ:\n\n"
                    f"ಈ ಪರಿಕಲ್ಪನೆಯು ಪ್ರಮುಖ ತತ್ತ್ವಗಳ ಮೇಲೆ ಆಧಾರಿತವಾಗಿದೆ. ವ್ಯವಸ್ಥಿತವಾಗಿ ವಿಷಯವನ್ನು ವಿಶ್ಲೇಷಿಸಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು ಮುಖ್ಯವಾಗಿದೆ.\n\n"
                    f"ಆಕರ: {citations_str}\n\n"
                    f"ಮುಂದಿನ ಹಂತವಾಗಿ ನೀವು ಅಭ್ಯಾಸ ರಸಪ್ರಶ್ನೆ ತೆಗೆದುಕೊಳ್ಳಲು ಬಯಸುತ್ತೀರಾ?"
                )
            else:
                return (
                    f"ನಮಸ್ಕಾರ! '{query}' ಕುರಿತು:\n\n"
                    f"ಇದು ಬಹಳ ಮುಖ್ಯವಾದ ಅಧ್ಯಯನ ವಿಷಯ. ನಿಖರವಾದ ಮಾಹಿತಿಗಾಗಿ ದಯವಿಟ್ಟು ನಿಮ್ಮ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ (PDF/Notes) ಅನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ."
                )

        else: # Default English
            if retrieved_contexts:
                top_context = retrieved_contexts[0]
                excerpt = top_context.get("excerpt", "").strip()
                return (
                    f"Hello! Based directly on your uploaded study materials regarding **\"{query}\"**:\n\n"
                    f"According to your materials, the key principle states:\n"
                    f"> \"{excerpt}\"\n\n"
                    f"### Key Takeaways:\n"
                    f"1. **Core Concept**: Systematically breaks down the required operations with predictable complexity.\n"
                    f"2. **Implementation Details**: Follows clean design principles with validation checks.\n"
                    f"3. **Practical Application**: Recommended to reinforce with targeted quiz exercises.\n\n"
                    f"Reference: {citations_str}"
                )
            else:
                return (
                    f"Hello! Regarding your inquiry about **\"{query}\"**:\n\n"
                    f"This is a foundational concept within your learning curriculum. To provide answers strictly grounded in your specific class materials, "
                    f"please upload your PDF, TXT, or Markdown notes using the left panel.\n\n"
                    f"In general, mastering this topic involves understanding prerequisites, analyzing edge cases, and applying continuous deliberate practice."
                )

    def generate_quiz_questions(
        self,
        topic: str,
        difficulty: str = "INTERMEDIATE",
        count: int = 4
    ) -> List[Dict[str, Any]]:
        diff_str = difficulty.upper()
        return [
            {
                "questionText": f"In the context of {topic}, which principle is most critical for optimizing performance at {diff_str} level?",
                "options": [
                    "Minimizing redundant computational passes and caching results",
                    "Ignoring edge cases during initial prototype phase",
                    "Allocating arbitrary memory buffers",
                    "Replacing modular abstractions with monolithic scripts"
                ],
                "correctOptionIndex": 0,
                "explanation": "Minimizing redundant operations and utilizing caching/memoization preserves CPU cycles and memory bandwidth.",
                "difficulty": diff_str
            },
            {
                "questionText": f"Which metric or validation method is recommended when assessing {topic} implementations?",
                "options": [
                    "Manual visual inspection only",
                    "Automated unit testing with edge-case test coverage",
                    "Skipping regression suites",
                    "Random guess verification"
                ],
                "correctOptionIndex": 1,
                "explanation": "Automated unit testing with edge-case coverage guarantees structural correctness and prevents regressions.",
                "difficulty": diff_str
            },
            {
                "questionText": f"True or False: In {topic}, prerequisite knowledge of underlying data structures prevents architectural bottlenecks.",
                "options": ["True", "False"],
                "correctOptionIndex": 0,
                "explanation": "Choosing the right underlying data structures directly dictates asymptotic time and space complexity.",
                "difficulty": diff_str
            },
            {
                "questionText": f"What is the standard convention when handling unexpected errors in {topic} workflows?",
                "options": [
                    "Silently suppressing all runtime exceptions",
                    "Throwing specific exceptions with contextual diagnostic messages",
                    "Terminating the host operating system immediately",
                    "Hardcoding static return values for all queries"
                ],
                "correctOptionIndex": 1,
                "explanation": "Explicit contextual exceptions with diagnostic information enable swift debugging and resilient fault tolerance.",
                "difficulty": diff_str
            }
        ][:count]
