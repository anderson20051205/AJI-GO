from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import Carrito, CarritoItem, Resena, HistorialPedido, MetodoPago
from schemas import (
    CarritoOut, CarritoItemIn,
    ResenaIn, ResenaOut,
    HistorialIn, HistorialOut, ActualizarStatusIn,
    MetodoPagoOut,
)

router = APIRouter()


# ── Carrito ────────────────────────────────────────────────────────────────────

@router.get("/carrito/{usuario_id}", response_model=CarritoOut)
def get_carrito(usuario_id: int, db: Session = Depends(get_db)):
    """Obtiene el carrito activo del usuario. Si no existe lo crea vacío."""
    carrito = db.query(Carrito).filter(Carrito.UsuarioID == usuario_id).first()
    if not carrito:
        # Crear carrito vacío automáticamente
        carrito = Carrito(UsuarioID=usuario_id)
        db.add(carrito)
        db.commit()
        db.refresh(carrito)
    return carrito


@router.post("/carrito/{usuario_id}/items", response_model=CarritoOut, status_code=201)
def add_item(
    usuario_id: int,
    item_in: CarritoItemIn,
    sucursal_id: Optional[int] = Query(default=None),
    restaurant: Optional[str] = Query(default=None),
    db: Session = Depends(get_db)
):
    """Agrega un item al carrito. Crea el carrito si no existe."""
    carrito = db.query(Carrito).filter(Carrito.UsuarioID == usuario_id).first()
    if not carrito:
        carrito = Carrito(
            UsuarioID=usuario_id,
            SucursalID=sucursal_id,
            RestaurantNombre=restaurant
        )
        db.add(carrito)
        db.commit()
        db.refresh(carrito)
    elif sucursal_id and not carrito.SucursalID:
        carrito.SucursalID = sucursal_id
        carrito.RestaurantNombre = restaurant
        db.commit()

    item = CarritoItem(CarritoID=carrito.CarritoID, **item_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(carrito)
    return carrito


@router.put("/carrito/{usuario_id}/items/{item_id}", response_model=CarritoOut)
def update_item(
    usuario_id: int,
    item_id: int,
    item_in: CarritoItemIn,
    db: Session = Depends(get_db)
):
    """Actualiza cantidad o notas de un item del carrito."""
    item = db.query(CarritoItem).filter(CarritoItem.ItemID == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item no encontrado")

    for field, value in item_in.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()

    carrito = db.query(Carrito).filter(Carrito.UsuarioID == usuario_id).first()
    db.refresh(carrito)
    return carrito


@router.delete("/carrito/{usuario_id}/items/{item_id}", status_code=204)
def remove_item(usuario_id: int, item_id: int, db: Session = Depends(get_db)):
    """Elimina un item del carrito."""
    item = db.query(CarritoItem).filter(CarritoItem.ItemID == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    db.delete(item)
    db.commit()


@router.delete("/carrito/{usuario_id}", status_code=204)
def vaciar_carrito(usuario_id: int, db: Session = Depends(get_db)):
    """Vacía todos los items del carrito (después de confirmar el pedido)."""
    carrito = db.query(Carrito).filter(Carrito.UsuarioID == usuario_id).first()
    if carrito:
        db.query(CarritoItem).filter(CarritoItem.CarritoID == carrito.CarritoID).delete()
        carrito.SucursalID = None
        carrito.RestaurantNombre = None
        db.commit()


# ── Reseñas ────────────────────────────────────────────────────────────────────

@router.post("/resenas", response_model=ResenaOut, status_code=201)
def create_resena(resena_in: ResenaIn, db: Session = Depends(get_db)):
    """Crea una reseña para un pedido entregado."""
    if not (1 <= resena_in.Puntuacion <= 5):
        raise HTTPException(status_code=400, detail="Puntuación debe ser entre 1 y 5")

    # Evitar reseñas duplicadas por pedido
    existente = db.query(Resena).filter(
        Resena.PedidoID == resena_in.PedidoID,
        Resena.UsuarioID == resena_in.UsuarioID
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe una reseña para este pedido")

    resena = Resena(**resena_in.model_dump())
    db.add(resena)
    db.commit()
    db.refresh(resena)
    return resena


@router.get("/resenas/pedido/{pedido_id}", response_model=ResenaOut)
def get_resena(pedido_id: int, db: Session = Depends(get_db)):
    resena = db.query(Resena).filter(Resena.PedidoID == pedido_id).first()
    if not resena:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    return resena


@router.get("/resenas/usuario/{usuario_id}", response_model=List[ResenaOut])
def get_resenas_usuario(usuario_id: int, db: Session = Depends(get_db)):
    return db.query(Resena).filter(Resena.UsuarioID == usuario_id).all()


# ── Historial ─────────────────────────────────────────────────────────────────

@router.post("/historial", response_model=HistorialOut, status_code=201)
def registrar_historial(historial_in: HistorialIn, db: Session = Depends(get_db)):
    """
    Llamado desde el servicio de pedidos cuando se confirma un pedido.
    Guarda el snapshot para mostrarlo en UserProfileModal.
    """
    historial = HistorialPedido(**historial_in.model_dump())
    db.add(historial)
    db.commit()
    db.refresh(historial)
    return historial


@router.get("/historial/{usuario_id}", response_model=List[HistorialOut])
def get_historial(usuario_id: int, db: Session = Depends(get_db)):
    """Historial de pedidos del usuario para UserProfileModal."""
    return (
        db.query(HistorialPedido)
        .filter(HistorialPedido.UsuarioID == usuario_id)
        .order_by(HistorialPedido.FechaPedido.desc())
        .all()
    )


@router.patch("/historial/{pedido_id}/status", status_code=200)
def actualizar_status_historial(
    pedido_id: int,
    body: ActualizarStatusIn,
    db: Session = Depends(get_db)
):
    """
    Actualiza el status en el historial cuando cambia en el servicio de pedidos.
    Así UserProfileModal siempre muestra el estado actualizado.
    """
    historial = db.query(HistorialPedido).filter(
        HistorialPedido.PedidoID == pedido_id
    ).first()
    if not historial:
        raise HTTPException(status_code=404, detail="Historial no encontrado")
    historial.Status = body.Status
    db.commit()
    return {"mensaje": "Status actualizado"}


# ── Métodos de Pago ────────────────────────────────────────────────────────────

@router.get("/metodos-pago", response_model=List[MetodoPagoOut])
def get_metodos_pago(db: Session = Depends(get_db)):
    """Lista los métodos de pago disponibles."""
    return db.query(MetodoPago).all()
