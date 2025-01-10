from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers.users import UserCreate
from app.models import User
from app.auth import hash_password
from app.routers import users, images
from fastapi.staticfiles import StaticFiles

# Создание приложения FastAPI
app = FastAPI()
app.include_router(images.router)
app.mount("/static", StaticFiles(directory="output"), name="static")
app.include_router(images.router, prefix="/images")
app.include_router(users.router, prefix="/users", tags=["users"])

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Укажите адрес вашего Frontend
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы
    allow_headers=["*"],  # Разрешаем все заголовки
)

# Middleware для логирования запросов
@app.middleware("http")
async def log_requests(request, call_next):
    print(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    print(f"Response status: {response.status_code}")
    return response

# Маршрут для регистрации пользователя
@app.post("/users/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Проверяем, существует ли пользователь
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Создаём нового пользователя
    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()

    return {"message": "User registered successfully"}
