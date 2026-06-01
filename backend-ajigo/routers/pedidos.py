from fastapi import APIRouter, HTTPException
from ..schemas.pedidos import OrderCreate, OrderResponse
import random
from datetime import datetime
from typing import List

router = APIRouter(prefix="/orders", tags=["Orders Operations"])

# Simulador de pedidos (Contiene las 3 transacciones iniciales de App.jsx para reportar contabilidad)
MOCK_ORDERS_DB = [
    {
        "id": "AG-482910", "subtotal": 25.00, "deliveryFee": 1.50, "discount": 0.0, "tax": 4.77, "total": 26.50, "coupon": None,
        "restaurant": "Piedra Negra", "status": 3, "createdAt": "08:35 AM",
        "items": [{"id": "item1", "baseId": "pn1", "name": "Espresso Orgánico", "restaurant": "Piedra Negra", "badgeText": "PN", "price": 6.50, "quantity": 2, "size": "Estándar", "extras": []}],
        "deliveryDetails": {"method": "delivery", "faculty": "Facultad de Ciencias Técnicas", "floor": "Piso 1", "classroom": "Aula 102"}
    }
]

@router.post("/", response_model=OrderResponse)
async def create_order(order_in: OrderCreate):
    new_id = f"AG-{random.randint(100000, 999990)}"
    time_str = datetime.now().strftime("%I:%M %p")
    
    primary_restaurant = order_in.items[0].restaurant if order_in.items else "UIDE Bakery"
    
    new_order = order_in.dict()
    new_order.update({
        "id": new_id,
        "status": 0,  # 0 = Recibido
        "createdAt": time_str,
        "restaurant": primary_restaurant,
        "driverName": None, "driverVehicle": None, "driverPhone": None
    })
    
    MOCK_ORDERS_DB.insert(0, new_order)
    return new_order

@router.get("/", response_model=List[OrderResponse])
async def get_orders():
    return MOCK_ORDERS_DB

@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(order_id: str, status_code: int):
    for order in MOCK_ORDERS_DB:
        if order["id"] == order_id:
            if status_code < 0 or status_code > 3:
                raise HTTPException(status_code=400, detail="Código de estado inválido (0-3).")
            order["status"] = status_code
            return order
    raise HTTPException(status_code=404, detail="Pedido no encontrado.")

@router.patch("/{order_id}/assign-driver", response_model=OrderResponse)
async def assign_driver(order_id: str, driver_name: str):
    for order in MOCK_ORDERS_DB:
        if order["id"] == order_id:
            order.update({
                "driverName": driver_name,
                "driverVehicle": "Motocicleta Honda (AJI-990)",
                "driverPhone": "+593 98 765 4321",
                "status": 2  # Cambia automáticamente a Despachado / Listo en Camino
            })
            return order
    raise HTTPException(status_code=404, detail="Pedido no encontrado.")