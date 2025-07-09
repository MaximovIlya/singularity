from fastapi import APIRouter
from api.schemas.query import QueryRequest
from controllers.get_query_controller import get_query_controller

router = APIRouter(tags=["Agent"])

@router.post("/get_query")
def get_query(request: QueryRequest):
    return get_query_controller(request)
