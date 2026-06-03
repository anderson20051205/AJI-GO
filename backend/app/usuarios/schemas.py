from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ── Carrito ────────────────────────────────────────────────────────────────────
class CarritoItemIn(BaseModel):
    ProductoID: int
    Cantidad: int
    Notas: Optional[str] = None

class CarritoItemOut(CarritoItemIn):
    ItemID: int
    class Config:
        from_attributes = True

class CarritoOut(BaseModel):
    CarritoID: int
    UsuarioID: int
    SucursalID: Optional[int]
    items: List[CarritoItemOut] = []
    class Config:
        from_attributes = True


# ── Reseñas ────────────────────────────────────────────────────────────────────
class ResenaIn(BaseModel):
    PedidoID: int
    Puntuacion: int   # 1-5
    Comentario: Optional[str] = None

class ResenaOut(ResenaIn):
    ResenaID: int
    FechaResena: datetime
    class Config:
        from_attributes = True


# ── Historial ─────────────────────────────────────────────────────────────────
class HistorialOut(BaseModel):
    HistorialID: int
    PedidoID: int
    EstadoPedidoID: Optional[int]
    FechaCambio: datetime
    class Config:
        from_attributes = True


# ── MetodoPago ─────────────────────────────────────────────────────────────────
class MetodoPagoOut(BaseModel):
    MetodoPagoID: int
    NombreMetodo: str
    class Config:
        from_attributes = True