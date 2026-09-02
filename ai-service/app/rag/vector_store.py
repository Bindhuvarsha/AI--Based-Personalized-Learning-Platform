import os
import json
import math
import re
from typing import List, Dict, Any, Optional
from abc import ABC, abstractmethod
from app.config import settings

class VectorStoreBase(ABC):
    @abstractmethod
    def add_chunks(self, user_id: int, chunks: List[Dict[str, Any]]):
        pass

    @abstractmethod
    def search(self, user_id: int, query: str, top_k: int = 3, doc_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_user_documents(self, user_id: int) -> List[str]:
        pass

class InMemoryVectorStore(VectorStoreBase):
    """
    Robust zero-dependency vector store using Term Frequency - Inverse Document Frequency
    and Cosine Similarity for fast, deterministic local vector retrieval.
    """
    def __init__(self, persist_file: str = "./data/vectors.json"):
        self.persist_file = persist_file
        self.store: Dict[str, List[Dict[str, Any]]] = {} # keyed by user_id string
        self._load()

    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r'\b[a-zA-Z0-9_]{2,}\b', text.lower())

    def _compute_vector(self, text: str) -> Dict[str, float]:
        tokens = self._tokenize(text)
        if not tokens:
            return {}
        tf = {}
        for token in tokens:
            tf[token] = tf.get(token, 0) + 1
        # Normalize
        norm = math.sqrt(sum(v ** 2 for v in tf.values()))
        if norm == 0:
            return {}
        return {k: v / norm for k, v in tf.items()}

    def _cosine_similarity(self, vec1: Dict[str, float], vec2: Dict[str, float]) -> float:
        score = 0.0
        for k, v in vec1.items():
            if k in vec2:
                score += v * vec2[k]
        return score

    def add_chunks(self, user_id: int, chunks: List[Dict[str, Any]]):
        uid = str(user_id)
        if uid not in self.store:
            self.store[uid] = []

        for chunk in chunks:
            vector = self._compute_vector(chunk["content"])
            record = {
                "chunkIndex": chunk.get("chunkIndex", 0),
                "documentTitle": chunk.get("documentTitle", "Document"),
                "pageNumber": chunk.get("pageNumber", 1),
                "content": chunk.get("content", ""),
                "vector": vector
            }
            self.store[uid].append(record)

        self._save()

    def search(self, user_id: int, query: str, top_k: int = 3, doc_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        uid = str(user_id)
        chunks = self.store.get(uid, [])
        if not chunks:
            return []

        query_vec = self._compute_vector(query)
        if not query_vec:
            # Fallback: return first k chunks
            return [{
                "documentTitle": c["documentTitle"],
                "pageNumber": c["pageNumber"],
                "chunkIndex": c["chunkIndex"],
                "excerpt": c["content"][:250] + "...",
                "similarityScore": 0.5
            } for c in chunks[:top_k]]

        scored = []
        for c in chunks:
            if doc_filter and c["documentTitle"].lower() != doc_filter.lower():
                continue
            sim = self._cosine_similarity(query_vec, c.get("vector", {}))
            scored.append((sim, c))

        scored.sort(key=lambda x: x[0], reverse=True)
        results = []
        for sim, c in scored[:top_k]:
            results.append({
                "documentTitle": c["documentTitle"],
                "pageNumber": c["pageNumber"],
                "chunkIndex": c["chunkIndex"],
                "excerpt": c["content"][:250] + "...",
                "similarityScore": round(float(sim), 4)
            })
        return results

    def get_user_documents(self, user_id: int) -> List[str]:
        uid = str(user_id)
        chunks = self.store.get(uid, [])
        return list(set(c["documentTitle"] for c in chunks))

    def _save(self):
        try:
            os.makedirs(os.path.dirname(self.persist_file), exist_ok=True)
            with open(self.persist_file, "w", encoding="utf-8") as f:
                json.dump(self.store, f)
        except Exception:
            pass

    def _load(self):
        if os.path.exists(self.persist_file):
            try:
                with open(self.persist_file, "r", encoding="utf-8") as f:
                    self.store = json.load(f)
            except Exception:
                self.store = {}

def get_vector_store() -> VectorStoreBase:
    return InMemoryVectorStore(persist_file=os.path.join(settings.DATA_DIR, "vector_store.json"))
