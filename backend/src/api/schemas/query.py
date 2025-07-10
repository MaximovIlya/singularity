from pydantic import BaseModel

class QueryRequest(BaseModel):
    query: str
    messageHistory: str
    
