from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User
from app.auth import hash_password, verify_password, create_access_token
from pydantic import BaseModel


router = APIRouter()

class UserCreate(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str
    
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    print(f"Received registration data: {user}")
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}


@router.post("/login")
def login(user: LoginRequest, db: Session = Depends(get_db)):
    # Получаем данные из модели
    username = user.username
    password = user.password

    # Проверяем существование пользователя
    existing_user = db.query(User).filter(User.username == username).first()
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    # Проверяем пароль
    if not verify_password(password, existing_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid username or password")

    # Создаём JWT токен
    token = create_access_token({"sub": username})
    return {"access_token": token, "token_type": "bearer"}

