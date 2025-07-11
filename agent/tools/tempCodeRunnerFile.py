# Файл: tools/qa_tool.py
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
from langchain_chroma import Chroma
from agent.rag_components.data_loader import load_and_chunk_documents
from agent.rag_components.vector_store import create_vector_store

# Шаблон промпта, который инструктирует модель
RAG_PROMPT_TEMPLATE = """
Ты — дружелюбный ассистент, отвечающий по вопросам взаимного кредитования. 
Используй предоставленный ниже контекст и историю диалога, чтобы ответить на вопрос пользователя. Ответь коротко и по существу, дружелюбным тоном. 
Не пересказывай весь документ, а приведи только ту информацию, что отвечает на вопрос пользователя. 
Не добавляй информацию вне предоставленного контекста.
Не включай личные мнения, только факты
Не повторяй вопрос и не перечисляй пункты, если об этом не просили. 

Контекст:
{context}

Вопрос:
{question}

История диалога:
{chat_history}

Ответ:
"""

def format_docs(docs):
    """
    Форматирует список документов в единую строку.
    """
    return "\n\n".join(doc.page_content for doc in docs)

def create_qa_rag_chain(vector_store: Chroma):
    # Загрузка переменных окружения из .env
    load_dotenv()
    openai_api_key = os.getenv("OPENAI_API_KEY")

    retriever = vector_store.as_retriever(search_kwargs={"k": 2})

    llm = ChatOpenAI(
        model="gpt-3.5-turbo",
        temperature=0.2,
        openai_api_key=openai_api_key
    )
    prompt = ChatPromptTemplate.from_template(RAG_PROMPT_TEMPLATE)

    rag_chain = ({
        "context": retriever | format_docs, 
        "question": RunnablePassthrough(),
        "chat_history": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    return rag_chain