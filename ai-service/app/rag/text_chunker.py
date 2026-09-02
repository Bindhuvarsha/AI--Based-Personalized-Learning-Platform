import re
from typing import List, Dict, Any

class TextChunker:
    def __init__(self, chunk_size: int = 450, chunk_overlap: int = 60):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_document(self, parsed_pages: List[Dict[str, Any]], document_title: str) -> List[Dict[str, Any]]:
        chunks = []
        global_chunk_idx = 0

        for page in parsed_pages:
            page_num = page.get("page", 1)
            raw_text = page.get("text", "")
            if not raw_text.strip():
                continue

            paragraphs = re.split(r'\n\s*\n', raw_text)
            current_chunk = ""

            for para in paragraphs:
                para = para.strip()
                if not para:
                    continue

                if len(current_chunk) + len(para) <= self.chunk_size:
                    current_chunk = (current_chunk + " " + para).strip()
                else:
                    if current_chunk:
                        chunks.append({
                            "chunkIndex": global_chunk_idx,
                            "documentTitle": document_title,
                            "pageNumber": page_num,
                            "content": current_chunk
                        })
                        global_chunk_idx += 1

                    # Handle large paragraph splitting
                    if len(para) > self.chunk_size:
                        words = para.split()
                        sub_chunk = ""
                        for word in words:
                            if len(sub_chunk) + len(word) + 1 <= self.chunk_size:
                                sub_chunk = (sub_chunk + " " + word).strip()
                            else:
                                if sub_chunk:
                                    chunks.append({
                                        "chunkIndex": global_chunk_idx,
                                        "documentTitle": document_title,
                                        "pageNumber": page_num,
                                        "content": sub_chunk
                                    })
                                    global_chunk_idx += 1
                                sub_chunk = word
                        current_chunk = sub_chunk
                    else:
                        current_chunk = para

            if current_chunk:
                chunks.append({
                    "chunkIndex": global_chunk_idx,
                    "documentTitle": document_title,
                    "pageNumber": page_num,
                    "content": current_chunk
                })
                global_chunk_idx += 1

        return chunks
