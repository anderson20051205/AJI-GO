from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ── Carrito ────────────────────────────────────────────────────────────────────

class CarritoItemIn(BaseModel):
    ProductoID: Optional[int] = None
    Name: str
    BadgeText: Optional[str] = None
    Price: float
    Quantity: int
    Size: Optional[str] = None
    Extras: Optional[str] = None   # "Queso Extra, Tocino Ahumado"
    Notas: Optional[str] = None

class CarritoItemOut(BaseModel):
    ItemID: int
    ProductoID: Optional[int]
    Name: str
    BadgeText: Optional[str]
    Price: float
    Quantity: int
    Size: Optional[str]
    Extras: Optional[str]
    Notas: Optional[str]
    class Config:
        from_attributes = True

class CarritoOut(BaseModel):
    CarritoID: int
    UsuarioID: int
    SucursalID: Optional[int]
    RestaurantNombre: Optional[str]
    items: List[CarritoItemOut] = []
    class Config:
        from_attributes = True


# ── Reseñas ────────────────────────────────────────────────────────────────────

class ResenaIn(BaseModel):
    PedidoID: int
    UsuarioID: int
    Puntuacion: int        # 1-5
    Comentario: Optional[str] = None

class ResenaOut(BaseModel):
    ResenaID: int
    PedidoID: int
    UsuarioID: int
    Puntuacion: int
    Comentario: Optional[str]
    FechaResena: datetime
    class Config:
        from_attributes = True


# ── Historial ─────────────────────────────────────────────────────────────────

class HistorialIn(BaseModel):
    """Recibido desde el servicio de pedidos cuando se crea un pedido."""
    UsuarioID: int
    PedidoID: int
    CodigoExterno: Optional[str] = None
    RestaurantNombre: Optional[str] = None
    Status: int = 0
    Total: float
    DeliveryMethod: Optional[str] = None
    ItemsResumen: Optional[str] = None   # "2x Espresso, 1x Torta"

class HistorialOut(BaseModel):
    HistorialID: int
    UsuarioID: int
    PedidoID: int
    CodigoExterno: Optional[str]
    RestaurantNombre: Optional[str]
    Status: int
    Total: float
    DeliveryMethod: Optional[str]
    ItemsResumen: Optional[str]
    FechaPedido: datetime
    class Config:
        from_attributes = True

class ActualizarStatusIn(BaseModel):
    Status: int   # 0-3


# ── MetodoPago ─────────────────────────────────────────────────────────────────

class MetodoPagoOut(BaseModel):
    MetodoPagoID: int
    NombreMetodo: str
    class Config:
        from_attributes = True
