from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Carrito, CarritoItem, Resena, HistorialPedido, MetodoPago
from schemas import (
    CarritoOut, CarritoItemIn,
    ResenaIn, ResenaOut,
    HistorialOut, MetodoPagoOut,
)

router = APIRouter()


# ── Carrito ────────────────────────────────────────────────────────────────────

@router.get("/carrito/{usuario_id}", response_model=CarritoOut)
def get_carrito(usuario_id: int, db: Session = Depends(get_db)):
    carrito = db.query(Carrito).filter(Carrito.UsuarioID == usuario_id).first()
    if not carrito:
        raise HTTPException(status_code=404, detail="Carrito no encontrado")
    return carrito


@router.post("/carrito/{usuario_id}/items", response_model=CarritoOut, status_code=201)
def add_item(usuario_id: int, item_in: CarritoItemIn, sucursal_id: int = None, db: Session = Depends(get_db)):
    carrito = db.query(Carrito).filter(Carrito.UsuarioID == usuario_id).first()
    if not carrito:
        carrito = Carrito(UsuarioID=usuario_id, SucursalID=sucursal_id)
        db.add(carrito)
        db.commit()
        db.refresh(carrito)
    item = CarritoItem(CarritoID=carrito.CarritoID, **item_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(carrito)
    return carrito


@router.delete("/carrito/{usuario_id}/items/{item_id}", status_code=204)
def remove_item(usuario_id: int, item_id: int, db: Session = Depends(get_db)):
    item = db.query(CarritoItem).filter(CarritoItem.ItemID == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    db.delete(item)
    db.commit()


# ── Reseñas ────────────────────────────────────────────────────────────────────

@router.post("/resenas", response_model=ResenaOut, status_code=201)
def create_resena(resena_in: ResenaIn, db: Session = Depends(get_db)):
    if not (1 <= resena_in.Puntuacion <= 5):
        raise HTTPException(status_code=400, detail="Puntuación debe ser entre 1 y 5")
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


# ── Historial ─────────────────────────────────────────────────────────────────

@router.get("/historial/{usuario_id}", response_model=List[HistorialOut])
def get_historial(usuario_id: int, db: Session = Depends(get_db)):
    return db.query(HistorialPedido).filter(HistorialPedido.UsuarioID == usuario_id).all()


# ── Métodos de Pago ────────────────────────────────────────────────────────────

@router.get("/metodos-pago", response_model=List[MetodoPagoOut])
def get_metodos_pago(db: Session = Depends(get_db)):
    return db.query(MetodoPago).all()