# Файл: tools/qa_tool.py
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_together import ChatTogether
from langchain_chroma import Chroma
from rag_components.data_loader import load_and_chunk_documents
from rag_components.vector_store import create_vector_store

# Шаблон промпта, который инструктирует модель
RAG_PROMPT_TEMPLATE = """
Используйте предоставленный ниже контекст, чтобы ответить на вопрос пользователя.
Если вы не знаете ответа на основе предоставленного контекста, просто скажите, что вы не знаете. Не пытайтесь выдумывать ответ.

Контекст:
{context}

Вопрос:
{question}

Ответ:
"""

def format_docs(docs):
    """
    Форматирует список документов в единую строку.
    """
    return "\n\n".join(doc.page_content for doc in docs)

def create_qa_rag_chain(vector_store: Chroma):
    """
    Создает и возвращает RAG-цепочку для ответов на вопросы.
    """
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})

    llm = ChatTogether(
        model="deepseek-ai/DeepSeek-V3",
        temperature=0,
        together_api_key="5eb69efdc6d0b50e93018ea0f02f86710db98fb253ca58dd2541d033a3df3d8a"
    )
    prompt = ChatPromptTemplate.from_template(RAG_PROMPT_TEMPLATE)

    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    return rag_chain