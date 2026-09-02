from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.models.schemas import TutorChatRequest, TutorChatResponse, DocumentUploadResponse, SourceCitation
from app.rag.document_parser import DocumentParser
from app.rag.text_chunker import TextChunker
from app.rag.vector_store import get_vector_store
from app.ai.openai_provider import get_ai_provider

router = APIRouter(prefix="/tutor", tags=["RAG AI Tutor"])
vector_store = get_vector_store()
chunker = TextChunker()

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    userId: int = Form(...)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded")

    # 1. Parse document pages
    try:
        pages = DocumentParser.parse_file(contents, file.filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse document: {str(e)}")

    # 2. Chunk text
    chunks = chunker.chunk_document(pages, file.filename)

    # 3. Ingest into Vector Store
    vector_store.add_chunks(userId, chunks)

    return DocumentUploadResponse(
        documentTitle=file.filename,
        totalChunks=len(chunks),
        totalPages=len(pages),
        message=f"Successfully extracted {len(chunks)} chunks across {len(pages)} pages."
    )

@router.post("/chat", response_model=TutorChatResponse)
async def tutor_chat(request: TutorChatRequest):
    # 1. Retrieve top context chunks from vector store
    top_chunks = vector_store.search(
        user_id=request.userId,
        query=request.message,
        top_k=3,
        doc_filter=request.documentFilter
    )

    # 2. Generate grounded answer via AI Provider
    ai_provider = get_ai_provider()
    response_text = ai_provider.generate_tutor_response(
        query=request.message,
        retrieved_contexts=top_chunks,
        language=request.language
    )

    citations = [
        SourceCitation(
            documentTitle=c["documentTitle"],
            pageNumber=c["pageNumber"],
            chunkIndex=c["chunkIndex"],
            excerpt=c["excerpt"],
            similarityScore=c["similarityScore"]
        )
        for c in top_chunks
    ]

    return TutorChatResponse(
        response=response_text,
        language=request.language,
        sources=citations
    )

@router.get("/documents/{userId}")
async def get_user_documents(userId: int):
    docs = vector_store.get_user_documents(userId)
    return {"userId": userId, "documents": docs}
