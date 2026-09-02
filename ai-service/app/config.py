import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    AI_PROVIDER: str = "mock" # "mock" or "openai"
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    VECTOR_STORE_TYPE: str = "in_memory" # "in_memory" or "chroma"
    CHROMA_PERSIST_DIRECTORY: str = "./data/chroma"
    DATA_DIR: str = "./data"
    CHUNK_SIZE: int = 450
    CHUNK_OVERLAP: int = 60
    DEFAULT_LANGUAGE: str = "english"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

os.makedirs(settings.DATA_DIR, exist_ok=True)
os.makedirs(settings.CHROMA_PERSIST_DIRECTORY, exist_ok=True)
