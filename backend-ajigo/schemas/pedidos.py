from pydantic import BaseModel
from typing import List, Optional

class OrderItem(BaseModel):
    id: str
    baseId: str
    name: str
    restaurant: str
    badgeText: str
    price: float
    quantity: int
    size: str
    extras: List[str]
    notes: Optional[str] = None

class DeliveryDetails(BaseModel):
    method: str  # 'delivery' o 'pickup'
    faculty: str
    floor: Optional[str] = ""
    classroom: Optional[str] = ""
    notes: Optional[str] = ""

class OrderCreate(BaseModel):
    items: List[OrderItem]
    subtotal: float
    deliveryFee: float
    discount: float
    tax: float
    total: float
    coupon: Optional[str] = None
    deliveryDetails: DeliveryDetails

class OrderResponse(OrderCreate):
    id: str
    status: int  # 0: Recibido, 1: En Preparación, 2: Listo/En Camino, 3: Entregado
    createdAt: str
    restaurant: str
    driverName: Optional[str] = None
    driverVehicle: Optional[str] = None
    driverPhone: Optional[str] = None