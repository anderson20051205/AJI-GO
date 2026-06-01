from fastapi import APIRouter, HTTPException, status
from ..schemas.auth import UserRegister, UserLogin, TokenResponse
from ..core.security import get_password_hash, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Simulación de Base de Datos Temporal de Usuarios
MOCK_USERS_DB = {}

@router.post("/register", response_model=TokenResponse)
async def register(user_in: UserRegister):
    if user_in.email in MOCK_USERS_DB:
        raise HTTPException(status_code=400, detail="El correo electrónico ya está registrado.")
    
    hashed_password = get_password_hash(user_in.password)
    MOCK_USERS_DB[user_in.email] = {
        "name": user_in.name,
        "email": user_in.email,
        "password": hashed_password
    }
    
    token = create_access_token(data={"sub": user_in.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"name": user_in.name, "email": user_in.email}
    }

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = MOCK_USERS_DB.get(credentials.email)
    if not user:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas.")
        
    token = create_access_token(data={"sub": credentials.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"name": user["name"], "email": user["email"]}
    }