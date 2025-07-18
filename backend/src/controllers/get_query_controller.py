from  backend.src.api.schemas.query import QueryRequest
from fastapi.responses import JSONResponse

async def get_query_controller(request: QueryRequest, agent_executor=None):
    
    if agent_executor:
        result = await agent_executor.ainvoke({"q": request.query,"h": request.messageHistory})
        print(request.query)
        print(result)
        return JSONResponse(content={"received_query": request.query, "result": result})
    else:
        return JSONResponse(content={"received_query": request.query, "error": "Agent not initialized"})
    
