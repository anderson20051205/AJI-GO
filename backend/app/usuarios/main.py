from fastapi import FastAPI
from database import engine, Base, SessionLocal
from routes import router
from models import MetodoPago

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ajigo — Usuarios Service", version="1.0.0")
app.include_router(router)


@app.on_event("startup")
def seed_metodos_pago():
    """Carga los métodos de pago si la tabla está vacía."""
    db = SessionLocal()
    try:
        if db.query(MetodoPago).count() == 0:
            metodos = [
                MetodoPago(NombreMetodo="Efectivo"),
                MetodoPago(NombreMetodo="Transferencia"),
                MetodoPago(NombreMetodo="Tarjeta de Crédito"),
                MetodoPago(NombreMetodo="Tarjeta de Débito"),
            ]
            db.add_all(metodos)
            db.commit()
            print("✓ Métodos de pago cargados")
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok", "service": "usuarios"}
