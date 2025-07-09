from fastapi import FastAPI
from api.routes.agent import get_query

app = FastAPI(
    title="Query API",
    description="Example FastAPI Project",
    version="1.0.0"
)

# Регистрируем маршруты
app.include_router(get_query.router, prefix="/agent")
