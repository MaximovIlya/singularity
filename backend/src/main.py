from fastapi import FastAPI
from contextlib import asynccontextmanager
from backend.src.api.routes.agent import get_query
import sys
import os
from  agent.agent_creator import create_p2p_agent
import uvicorn

agent_executor = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Запуск инициализации агента...")
    app.state.agent_executor = create_p2p_agent()
    print("Агент готов к работе.")
    yield
    # (Optional) Cleanup code here

app = FastAPI(
    title="Query API",
    description="Example FastAPI Project",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(get_query.router, prefix="/agent")



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)