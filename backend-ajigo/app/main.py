from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ..routers import auth, tiendas, pedidos

app = FastAPI(
    title="AJI GO API - Premium Campus Delivery",
    description="Backend oficial desarrollado para el MVP de la Plataforma Multitienda UIDE",
    version="1.0.0"
)

# Configuración de CORS amplia para pruebas locales y despliegue en AWS S3/EC2
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inyección de Módulos de Rutas de la Arquitectura
app.include_router(auth.router)
app.include_router(tiendas.router)
app.include_router(pedidos.router)

@app.get("/")
def read_root():
    return {
        "app": "AJI GO API",
        "status": "Online",
        "environment": "Development - Mocking State"
    }