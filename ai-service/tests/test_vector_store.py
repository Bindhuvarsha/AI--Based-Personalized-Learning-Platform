import pytest
from app.rag.vector_store import InMemoryVectorStore

def test_vector_store_add_and_search(tmp_path):
    temp_file = str(tmp_path / "temp_vectors.json")
    store = InMemoryVectorStore(persist_file=temp_file)
    
    chunks = [
        {
            "chunkIndex": 0,
            "documentTitle": "PythonGuide.pdf",
            "pageNumber": 1,
            "content": "Python dictionaries utilize hash tables to achieve O(1) average lookup complexity."
        },
        {
            "chunkIndex": 1,
            "documentTitle": "PythonGuide.pdf",
            "pageNumber": 2,
            "content": "NumPy arrays provide contiguous memory buffers allowing fast vectorized matrix mathematics."
        }
    ]
    
    store.add_chunks(user_id=1, chunks=chunks)
    
    # Query for dictionaries
    results = store.search(user_id=1, query="dictionary hash table lookup", top_k=1)
    assert len(results) == 1
    assert results[0]["documentTitle"] == "PythonGuide.pdf"
    assert "dictionaries" in results[0]["excerpt"].lower()
    assert results[0]["similarityScore"] > 0.0
