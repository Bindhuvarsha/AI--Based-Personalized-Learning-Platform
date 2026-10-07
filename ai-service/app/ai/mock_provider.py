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

    def summarize_content(
        self,
        text: str,
        document_title: str = "Study Notes",
        language: str = "english"
    ) -> Dict[str, Any]:
        words = text.split()
        word_count = len(words)
        read_time = max(1, word_count // 200)

        # Extract sentences for summary
        sentences = [s.strip() for s in text.replace("\n", " ").split(".") if len(s.strip()) > 15]
        preview = ". ".join(sentences[:3]) + "." if len(sentences) >= 3 else text[:250] + "..."

        lang = language.lower()
        if lang == "hindi":
            return {
                "documentTitle": document_title,
                "executiveSummary": f"यह दस्तावेज़ '{document_title}' से संबंधित मुख्य अध्ययन सामग्री का सारांश प्रस्तुत करता है। इसमें मुख्य सिद्धांतों, व्यावहारिक प्रयोगों और दक्षता सुधार पर ध्यान केंद्रित किया गया है।\n\n{preview}",
                "keyTakeaways": [
                    f"दस्तावेज़ की मूल अवधारणा: {sentences[0] if sentences else 'मौलिक सिद्धांतों का व्यवस्थित अध्ययन।'}",
                    "जटिल समस्याओं को सरल घटकों में विभाजित करके दक्षता में सुधार।",
                    "सैद्धांतिक ज्ञान को व्यावहारिक अभ्यास और परीक्षण के साथ सुदृढ़ करना।",
                    "त्रुटि प्रबंधन और प्रदर्शन अनुकूलन को प्राथमिकता देना।"
                ],
                "flashcards": [
                    {"term": "मुख्य सिद्धांत (Core Principle)", "definition": "दस्तावेज़ में उल्लिखित आधारभूत वैचारिक संरचना।"},
                    {"term": "प्रणाली अनुकूलन (System Optimization)", "definition": "संसाधनों का न्यूनतम उपयोग और अधिकतम दक्षता प्राप्त करना।"},
                    {"term": "सत्यापन विधि (Validation)", "definition": "परिणामों की सटीकता सुनिश्चित करने के लिए नियमित परीक्षण।"}
                ],
                "estimatedReadTimeMinutes": read_time,
                "totalWords": word_count
            }
        elif lang == "kannada":
            return {
                "documentTitle": document_title,
                "executiveSummary": f"ಈ ಸಾರಾಂಶವು '{document_title}' ಕುರಿತಾದ ಅಧ್ಯಯನ ಮಾಹಿತಿಯನ್ನು ಒಳಗೊಂಡಿದೆ. ಮೂಲ ಪರಿಕಲ್ಪನೆಗಳು ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ಅನುಷ್ಠಾನದ ಕುರಿತು ವಿವರಣೆ ಇಲ್ಲಿದೆ.\n\n{preview}",
                "keyTakeaways": [
                    f"ಪ್ರಮುಖ ಪರಿಕಲ್ಪನೆ: {sentences[0] if sentences else 'ವ್ಯವಸ್ಥಿತ ಅಧ್ಯಯನ ಕ್ರಮ.'}",
                    "ದಕ್ಷತೆಯನ್ನು ಹೆಚ್ಚಿಸಲು ಸಮಸ್ಯೆಗಳನ್ನು ಸರಳಗೊಳಿಸಿ ಪರಿಹರಿಸುವುದು.",
                    "ನಿರಂತರ ಅಭ್ಯಾಸ ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷೆಯ ಮೂಲಕ ಜ್ಞಾನ ಬಲವರ್ಧನೆ.",
                    "ದೋಷ ನಿರ್ವಹಣೆ ಮತ್ತು ಸುಧಾರಿತ ವಿನ್ಯಾಸ ತತ್ತ್ವಗಳು."
                ],
                "flashcards": [
                    {"term": "ಮೂಲ ತತ್ತ್ವ (Core Principle)", "definition": "ವಿಷಯದ ಆಧಾರಭೂತ ಪರಿಕಲ್ಪನಾ ರಚನೆ."},
                    {"term": "ದಕ್ಷತೆ (Efficiency)", "definition": "ಕನಿಷ್ಠ ಸಂಪನ್ಮೂಲಗಳೊಂದಿಗೆ ಗರಿಷ್ಠ ಫಲಿತಾಂಶ ಪಡೆಯುವುದು."},
                    {"term": "ದೃಢೀಕರಣ (Validation)", "definition": "ನಿಖರತೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ನಡೆಸುವ ಮೌಲ್ಯಮಾಪನ."}
                ],
                "estimatedReadTimeMinutes": read_time,
                "totalWords": word_count
            }
        else:
            return {
                "documentTitle": document_title,
                "executiveSummary": (
                    f"This document summary synthesizes key conceptual frameworks and technical mechanisms from \"{document_title}\". "
                    f"The analysis prioritizes architectural clarity, procedural execution, and core domain invariants.\n\n"
                    f"Key Context: {preview}"
                ),
                "keyTakeaways": [
                    f"Core Foundation: {sentences[0] if sentences else 'Systematic approach to domain fundamentals and invariants.'}",
                    f"Operational Architecture: {sentences[1] if len(sentences) > 1 else 'Decomposition of complex tasks into modular and testable units.'}",
                    f"Performance & Scale: {sentences[2] if len(sentences) > 2 else 'Algorithmic efficiency and low-latency throughput.'}",
                    "Best Practices: Rigorous regression testing, comprehensive boundary check validation, and proactive error logging."
                ],
                "flashcards": [
                    {
                        "term": "Architectural Invariant",
                        "definition": "A foundational property or condition that remains consistently true throughout all system states."
                    },
                    {
                        "term": "Algorithmic Efficiency",
                        "definition": "Minimizing asymptotic time and memory space overhead through optimal data structure selection."
                    },
                    {
                        "term": "Modular Decomposition",
                        "definition": "Partitioning complex software systems into decoupled, individually verifiable components."
                    },
                    {
                        "term": "Defensive Validation",
                        "definition": "Verifying input parameters and boundary thresholds to prevent invalid operational states."
                    }
                ],
                "estimatedReadTimeMinutes": read_time,
                "totalWords": word_count
            }

    def generate_quiz_from_content(
        self,
        text: str,
        count: int = 5,
        difficulty: str = "INTERMEDIATE"
    ) -> List[Dict[str, Any]]:
        diff_str = difficulty.upper()
        sentences = [s.strip() for s in text.replace("\n", " ").split(".") if len(s.strip()) > 20]
        sample_s1 = sentences[0] if len(sentences) > 0 else "Systematic modular design improves reliability"
        sample_s2 = sentences[1] if len(sentences) > 1 else "Performance optimization requires caching and minimal allocations"
        sample_s3 = sentences[2] if len(sentences) > 2 else "Defensive programming guarantees predictable failure handling"

        questions = [
            {
                "questionText": f"Based on the uploaded study material, what is the primary conclusion regarding: \"{sample_s1[:80]}...\"?",
                "options": [
                    "It establishes an architectural foundation essential for reliability and scalability.",
                    "It is considered obsolete and should be bypassed during execution.",
                    "It solely increases latency without functional benefit.",
                    "It only applies to legacy unmanaged hardware environments."
                ],
                "correctOptionIndex": 0,
                "explanation": f"According to the text, this principle directly underpins structural correctness and system reliability.",
                "difficulty": diff_str
            },
            {
                "questionText": f"According to the provided notes, how is optimal throughput achieved in relation to: \"{sample_s2[:80]}...\"?",
                "options": [
                    "By eliminating automated testing suites.",
                    "By utilizing caching, reducing redundant passes, and optimizing resource pipelines.",
                    "By increasing thread contention and unconstrained memory buffers.",
                    "By ignoring asymptotic boundary limits."
                ],
                "correctOptionIndex": 1,
                "explanation": "The text emphasizes optimizing computational pipelines and minimizing redundant operations to maximize throughput.",
                "difficulty": diff_str
            },
            {
                "questionText": f"True or False: According to the document, {sample_s3[:75]} must be maintained under concurrent operations.",
                "options": ["True", "False"],
                "correctOptionIndex": 0,
                "explanation": "The uploaded material highlights that maintaining defensive invariants is mandatory across all execution paths.",
                "difficulty": diff_str
            },
            {
                "questionText": "What diagnostic practice is recommended when encountering edge-case errors described in the notes?",
                "options": [
                    "Suppress all logging to reduce disk write bandwidth.",
                    "Employ contextual error messages with explicit telemetry and assertions.",
                    "Crash the host runtime silently.",
                    "Assume inputs are always well-formed without validation."
                ],
                "correctOptionIndex": 1,
                "explanation": "Contextual error logging and assertive boundary checks are standard practices emphasized in the material.",
                "difficulty": diff_str
            },
            {
                "questionText": "How does the document advise engineering teams to structure modular components for future maintenance?",
                "options": [
                    "Coupling all components into a single monolithic script.",
                    "Decoupling concerns with explicit interfaces and independent unit tests.",
                    "Relying exclusively on global shared state.",
                    "Deprecating version control workflows."
                ],
                "correctOptionIndex": 1,
                "explanation": "Decoupling concerns and writing targeted unit tests guarantees maintainability and prevents side-effect regressions.",
                "difficulty": diff_str
            }
        ]
        return questions[:count]
