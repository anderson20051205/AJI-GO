from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class MetodoPago(Base):
    __tablename__ = "metodos_pago"

    MetodoPagoID = Column(Integer, primary_key=True, index=True)
    NombreMetodo = Column(String(100), nullable=False)  # Efectivo, Transferencia, Tarjeta


class Carrito(Base):
    """Un usuario tiene un carrito activo por sucursal."""
    __tablename__ = "carritos"

    CarritoID          = Column(Integer, primary_key=True, index=True)
    UsuarioID          = Column(Integer, nullable=False)      # FK lógico → auth.usuarios
    SucursalID         = Column(Integer, nullable=True)       # FK lógico → catalogo.sucursales
    RestaurantNombre   = Column(String(100), nullable=True)   # "Piedra Negra"
    FechaActualizacion = Column(DateTime, server_default=func.now(), onupdate=func.now())

    items = relationship("CarritoItem", back_populates="carrito", cascade="all, delete-orphan")


class CarritoItem(Base):
    __tablename__ = "carrito_items"

    ItemID      = Column(Integer, primary_key=True, index=True)
    CarritoID   = Column(Integer, ForeignKey("carritos.CarritoID"), nullable=False)
    ProductoID  = Column(Integer, nullable=True)       # FK lógico → catalogo.productos
    Name        = Column(String(200), nullable=False)  # snapshot del nombre
    BadgeText   = Column(String(10), nullable=True)    # "PN", "EC", "CO", "UB"
    Price       = Column(Float, nullable=False)        # precio con size y extras ya sumados
    Quantity    = Column(Integer, nullable=False)
    Size        = Column(String(50), nullable=True)    # "Estándar", "Familiar", "Gigante"
    Extras      = Column(String(500), nullable=True)   # "Queso Extra, Tocino Ahumado"
    Notas       = Column(String(500), nullable=True)

    carrito = relationship("Carrito", back_populates="items")


class Resena(Base):
    __tablename__ = "resenas"

    ResenaID    = Column(Integer, primary_key=True, index=True)
    PedidoID    = Column(Integer, nullable=False)   # FK lógico → pedidos.pedidos
    UsuarioID   = Column(Integer, nullable=False)   # quien dejó la reseña
    Puntuacion  = Column(Integer, nullable=False)   # 1 a 5
    Comentario  = Column(Text, nullable=True)
    FechaResena = Column(DateTime, server_default=func.now())


class HistorialPedido(Base):
    """
    Snapshot del pedido guardado en el servicio de usuarios.
    Se registra cuando el pedido es creado en el servicio de pedidos.
    Contiene toda la info que muestra UserProfileModal.
    """
    __tablename__ = "historial_pedidos"

    HistorialID      = Column(Integer, primary_key=True, index=True)
    UsuarioID        = Column(Integer, nullable=False)
    PedidoID         = Column(Integer, nullable=False)          # ID en pedidos service
    CodigoExterno    = Column(String(20), nullable=True)        # "AG-482910"
    RestaurantNombre = Column(String(100), nullable=True)       # "Piedra Negra"
    Status           = Column(Integer, nullable=False, default=0)
    # 0=Recibido, 1=En Preparación, 2=Listo/En Camino, 3=Entregado
    Total            = Column(Float, nullable=False, default=0)
    DeliveryMethod   = Column(String(20), nullable=True)        # "delivery" o "pickup"
    ItemsResumen     = Column(String(1000), nullable=True)      # "2x Espresso, 1x Torta"
    FechaPedido      = Column(DateTime, server_default=func.now())
