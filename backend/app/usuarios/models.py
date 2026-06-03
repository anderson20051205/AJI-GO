from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class MetodoPago(Base):
    __tablename__ = "metodos_pago"

    MetodoPagoID = Column(Integer, primary_key=True, index=True)
    NombreMetodo = Column(String, nullable=False)  # Efectivo, Transferencia, etc.


class Carrito(Base):
    """Un usuario puede tener un carrito por sucursal."""
    __tablename__ = "carritos"

    CarritoID          = Column(Integer, primary_key=True, index=True)
    UsuarioID          = Column(Integer, nullable=False)   # FK lógico → auth.usuarios
    SucursalID         = Column(Integer, nullable=True)    # FK lógico → catalogo.sucursales
    FechaActualizacion = Column(DateTime, server_default=func.now(), onupdate=func.now())

    items = relationship("CarritoItem", back_populates="carrito", cascade="all, delete-orphan")


class CarritoItem(Base):
    __tablename__ = "carrito_items"

    ItemID     = Column(Integer, primary_key=True, index=True)
    CarritoID  = Column(Integer, ForeignKey("carritos.CarritoID"), nullable=False)
    ProductoID = Column(Integer, nullable=False)   # FK lógico → catalogo.productos
    Cantidad   = Column(Integer, nullable=False)
    Notas      = Column(String, nullable=True)

    carrito = relationship("Carrito", back_populates="items")


class Resena(Base):
    __tablename__ = "resenas"

    ResenaID    = Column(Integer, primary_key=True, index=True)
    PedidoID    = Column(Integer, nullable=False)   # FK lógico → pedidos.pedidos
    Puntuacion  = Column(Integer, nullable=False)   # 1 a 5
    Comentario  = Column(String, nullable=True)
    FechaResena = Column(DateTime, server_default=func.now())


class HistorialPedido(Base):
    """Vista personal del historial de pedidos del cliente."""
    __tablename__ = "historial_pedidos"

    HistorialID    = Column(Integer, primary_key=True, index=True)
    UsuarioID      = Column(Integer, nullable=False)
    PedidoID       = Column(Integer, nullable=False)
    EstadoPedidoID = Column(Integer, nullable=True)
    FechaCambio    = Column(DateTime, server_default=func.now())