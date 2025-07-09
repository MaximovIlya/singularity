from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import List
from langchain_core.documents import Document
def load_and_chunk_documents(file_path: str) -> List:
    """
    Загружает документ из файла и разбивает его на чанки.
    """
    # Загрузка документа
    loader = TextLoader(file_path, encoding='utf-8')
    documents = loader.load()
    # Инициализация сплиттера
    # chunk_size - максимальный размер чанка в символах.
    # chunk_overlap - количество символов перекрытия между чанками для сохранения контекста.
    text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\n\n", "\n", " ", ""] # Иерархия разделителей
    )
# Разбиение документа на чанки
    chunked_docs = text_splitter.split_documents(documents)
    print(f"Документ '{file_path}' разбит на {len(chunked_docs)} чанков.")
    return chunked_docs