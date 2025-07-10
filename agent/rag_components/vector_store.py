from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from typing import List
from langchain_core.documents import Document
import os
import shutil
from dotenv import load_dotenv

def create_vector_store(chunked_docs: List, collection_name: str = "credit_platform_docs"):
    """
    Создает векторное хранилище из чанков документов.
    """
    # Абсолютный путь к папке agent/chroma_db
    agent_dir = os.path.dirname(os.path.abspath(__file__))
    persist_dir = os.path.join(agent_dir, "../chroma_db")
    persist_dir = os.path.abspath(persist_dir)

    # Загрузка переменных окружения из .env
    load_dotenv()

    embeddings = OpenAIEmbeddings(
        model="text-embedding-3-small"
    )

    # Загружаем или создаём хранилище
    vector_store = Chroma(
        collection_name=collection_name,
        persist_directory=persist_dir,
        embedding_function=embeddings
    )
    # Очищаем коллекцию, если она уже существует
    existing_ids = vector_store.get()["ids"]
    if existing_ids:
        vector_store.delete(ids=existing_ids)
    # Добавляем новые документы
    vector_store.add_documents(chunked_docs)

    print(f"Векторное хранилище '{collection_name}' обновлено и содержит {len(vector_store.get()['ids'])} документов.")
    return vector_store