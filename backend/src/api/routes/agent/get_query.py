from fastapi import APIRouter, Depends, Request
from backend.src.api.schemas.query import QueryRequest
from backend.src.controllers.get_query_controller import get_query_controller

router = APIRouter(tags=["Agent"])

@router.post("/get_query")
async def get_query(request: QueryRequest, req: Request):
    agent_executor = req.app.state.agent_executor
    return await get_query_controller(request, agent_executor)
