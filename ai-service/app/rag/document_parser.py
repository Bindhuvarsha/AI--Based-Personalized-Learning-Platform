#retrieval augmented Generation
import io
from typing import List, Dict, Any
import fitz  # PyMuPDF

class DocumentParser:
    @staticmethod
    def parse_file(file_bytes: bytes, filename: str) -> List[Dict[str, Any]]:
        """
        Parses PDF, TXT, or Markdown files into structured pages.
        Returns a list of dicts: [{"page": int, "text": str}]
        """
        lower = filename.lower()
        if lower.endswith(".pdf"):
            return DocumentParser._parse_pdf(file_bytes)
        else:
            return DocumentParser._parse_text(file_bytes)

    @staticmethod
    def _parse_pdf(file_bytes: bytes) -> List[Dict[str, Any]]:
        pages = []
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        for i, page in enumerate(doc):
            text = page.get_text()
            if text and text.strip():
                pages.append({"page": i + 1, "text": text.strip()})
        doc.close()

        if not pages:
            pages.append({"page": 1, "text": "Empty document."})
        return pages

    @staticmethod
    def _parse_text(file_bytes: bytes) -> List[Dict[str, Any]]:
        try:
            content = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            content = file_bytes.decode("latin-1", errors="replace")

        return [{"page": 1, "text": content.strip()}]
