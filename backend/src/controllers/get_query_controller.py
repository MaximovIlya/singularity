from api.schemas.query import QueryRequest
from fastapi.responses import JSONResponse

def get_query_controller(request: QueryRequest):
    # Простейшая логика — можно заменить на вызов сервиса
    return JSONResponse(content={"received_query": request.query})
