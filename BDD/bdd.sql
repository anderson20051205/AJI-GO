CREATE DATABASE AJIGO;
USE AJIGO;

-- TABLA: ROLES
CREATE TABLE ROLES (
    RolID         INT          NOT NULL,
    RolSTR        NVARCHAR(50) NOT NULL,
    FechaCreacion DATETIME     NULL,
    CONSTRAINT PK_ROLES PRIMARY KEY (RolID)
);

-- TABLA: USUARIOS
CREATE TABLE USUARIOS (
    UsuarioID     INT           NOT NULL,
    RolID         INT           NOT NULL,
    NombreUsuario NVARCHAR(100) NULL,
    Email         NVARCHAR(150) NOT NULL,
    Contrasena    NVARCHAR(255) NOT NULL,
    Telefono      NVARCHAR(20)  NULL,
    Activo        BIT           NOT NULL,  -- Control para ban/suspender
    FechaRegistro DATETIME      NOT NULL,
    CONSTRAINT PK_USUARIOS PRIMARY KEY (UsuarioID),
    CONSTRAINT FK_USUARIOS_ROLES FOREIGN KEY (RolID)
        REFERENCES ROLES (RolID)
);

-- TABLA: SECTORES
CREATE TABLE SECTORES (
    SectorID  INT           NOT NULL,
    SectorSTR NVARCHAR(100) NOT NULL,
    CONSTRAINT PK_SECTORES PRIMARY KEY (SectorID)
);

-- TABLA: RESTAURANTES
CREATE TABLE RESTAURANTES (
    RestauranteID     INT           NOT NULL,
    NombreRestaurante NVARCHAR(150) NOT NULL,
    LogoURL           NVARCHAR(500) NULL,
    Descripcion       NVARCHAR(500) NULL,
    Activo            BIT           NOT NULL, 
    CONSTRAINT PK_RESTAURANTES PRIMARY KEY (RestauranteID)
);

-- TABLA: SUCURSALES
CREATE TABLE SUCURSALES (
    SucursalID    INT           NOT NULL,
    RestauranteID INT           NOT NULL,
    SectorID      INT           NOT NULL,
    UsuarioID     INT           NOT NULL,  -- Administrador responsable
    DireccionDesc NVARCHAR(300) NOT NULL,
    MapaURL       NVARCHAR(500) NULL,
    Telefono      NVARCHAR(20)  NULL,
    EstaAbierto   BIT           NOT NULL,  -- On/Off
    Activo        BIT           NOT NULL,  
    FechaRegistro DATETIME      NOT NULL,
    CONSTRAINT PK_SUCURSALES PRIMARY KEY (SucursalID),
    CONSTRAINT FK_SUCURSALES_RESTAURANTES FOREIGN KEY (RestauranteID)
        REFERENCES RESTAURANTES (RestauranteID),
    CONSTRAINT FK_SUCURSALES_SECTORES FOREIGN KEY (SectorID)
        REFERENCES SECTORES (SectorID),
    CONSTRAINT FK_SUCURSALES_USUARIOS FOREIGN KEY (UsuarioID)
        REFERENCES USUARIOS (UsuarioID)
);

-- TABLA: CATEGORIAS
CREATE TABLE CATEGORIAS (
    CategoriaID     INT           NOT NULL,
    NombreCategoria NVARCHAR(100) NOT NULL,  
    CONSTRAINT PK_CATEGORIAS PRIMARY KEY (CategoriaID)
);

-- TABLA: PRODUCTOS
CREATE TABLE PRODUCTOS (
    ProductoID     INT           NOT NULL,
    SucursalID     INT           NOT NULL,
    CategoriaID    INT           NOT NULL,
    NombreProducto NVARCHAR(150) NOT NULL,
    Descripcion    NVARCHAR(500) NULL,
    ImagenURL      NVARCHAR(500) NULL,
    Precio         FLOAT         NOT NULL,
    Stock          INT           NOT NULL,
    Activo         BIT           NOT NULL,  
    CONSTRAINT PK_PRODUCTOS PRIMARY KEY (ProductoID),
    CONSTRAINT FK_PRODUCTOS_SUCURSALES FOREIGN KEY (SucursalID)
        REFERENCES SUCURSALES (SucursalID),
    CONSTRAINT FK_PRODUCTOS_CATEGORIAS FOREIGN KEY (CategoriaID)
        REFERENCES CATEGORIAS (CategoriaID)
);

-- TABLA: TIPO_ENTREGA
CREATE TABLE TIPO_ENTREGA (
    TipoEntregaID  INT          NOT NULL,
    TipoEntregaSTR NVARCHAR(50) NOT NULL,  
    CONSTRAINT PK_TIPO_ENTREGA PRIMARY KEY (TipoEntregaID)
);

-- TABLA: ESTADOS_PEDIDO
CREATE TABLE ESTADOS_PEDIDO (
    EstadoPedidoID INT           NOT NULL,
    EstadoSTR      NVARCHAR(50)  NOT NULL, 
    MapaURL        NVARCHAR(500) NULL,
    CONSTRAINT PK_ESTADOS_PEDIDO PRIMARY KEY (EstadoPedidoID)
);

-- TABLA: METODOS_PAGO
CREATE TABLE METODOS_PAGO (
    MetodoPagoID INT           NOT NULL,
    NombreMetodo NVARCHAR(100) NOT NULL,  
    CONSTRAINT PK_METODOS_PAGO PRIMARY KEY (MetodoPagoID)
);

-- TABLA: ESTADO_ENVIO
CREATE TABLE ESTADO_ENVIO (
    EstadoID  INT          NOT NULL,
    EstadoSTR NVARCHAR(50) NOT NULL,
    CONSTRAINT PK_ESTADO_ENVIO PRIMARY KEY (EstadoID)
);

-- TABLA: DIRECCION_USUARIOS
CREATE TABLE DIRECCION_USUARIOS (
    DireccionUsuarioID INT           NOT NULL,
    UsuarioID          INT           NOT NULL,
    SectorID           INT           NOT NULL,
    Descripcion        NVARCHAR(300) NULL,
    MapaURL            NVARCHAR(500) NULL,
    CONSTRAINT PK_DIRECCION_USUARIOS PRIMARY KEY (DireccionUsuarioID),
    CONSTRAINT FK_DIRECCION_USUARIOS_USUARIOS FOREIGN KEY (UsuarioID)
        REFERENCES USUARIOS (UsuarioID),
    CONSTRAINT FK_DIRECCION_USUARIOS_SECTORES FOREIGN KEY (SectorID)
        REFERENCES SECTORES (SectorID)
);

-- TABLA: PEDIDOS
CREATE TABLE PEDIDOS (
    PedidoID           INT      NOT NULL,
    UsuarioID          INT      NOT NULL,  -- Cliente
    SucursalID         INT      NOT NULL,
    DireccionUsuarioID INT      NULL,      -- NULL si es Recogida
    TipoEntregaID      INT      NOT NULL,
    EstadoPedidoID     INT      NOT NULL,  -- Estado actual
    Subtotal           FLOAT    NOT NULL,
    CostoEnvio         FLOAT    NOT NULL,
    MontoTotal         FLOAT    NOT NULL,
    FechaPedido        DATETIME NOT NULL,
    CONSTRAINT PK_PEDIDOS PRIMARY KEY (PedidoID),
    CONSTRAINT FK_PEDIDOS_USUARIOS FOREIGN KEY (UsuarioID)
        REFERENCES USUARIOS (UsuarioID),
    CONSTRAINT FK_PEDIDOS_SUCURSALES FOREIGN KEY (SucursalID)
        REFERENCES SUCURSALES (SucursalID),
    CONSTRAINT FK_PEDIDOS_DIRECCION_USUARIOS FOREIGN KEY (DireccionUsuarioID)
        REFERENCES DIRECCION_USUARIOS (DireccionUsuarioID),
    CONSTRAINT FK_PEDIDOS_TIPO_ENTREGA FOREIGN KEY (TipoEntregaID)
        REFERENCES TIPO_ENTREGA (TipoEntregaID),
    CONSTRAINT FK_PEDIDOS_ESTADOS_PEDIDO FOREIGN KEY (EstadoPedidoID)
        REFERENCES ESTADOS_PEDIDO (EstadoPedidoID)
);

-- TABLA: DETALLE_PEDIDO
CREATE TABLE DETALLE_PEDIDO (
    DetalleID      INT           NOT NULL,
    PedidoID       INT           NOT NULL,
    ProductoID     INT           NOT NULL,
    Cantidad       INT           NOT NULL,
    PrecioUnitario FLOAT         NOT NULL,
    PrecioFinal    FLOAT         NOT NULL,
    Notas          NVARCHAR(300) NULL,
    CONSTRAINT PK_DETALLE_PEDIDO PRIMARY KEY (DetalleID),
    CONSTRAINT FK_DETALLE_PEDIDO_PEDIDOS FOREIGN KEY (PedidoID)
        REFERENCES PEDIDOS (PedidoID),
    CONSTRAINT FK_DETALLE_PEDIDO_PRODUCTOS FOREIGN KEY (ProductoID)
        REFERENCES PRODUCTOS (ProductoID)
);

-- TABLA: PAGOS
CREATE TABLE PAGOS (
    PagoID         INT           NOT NULL,
    PedidoID       INT           NOT NULL,
    MetodoPagoID   INT           NOT NULL,
    Monto          FLOAT         NOT NULL,
    EstadoPago     NVARCHAR(50)  NOT NULL,  -- Pendiente, Completado
    ComprobanteURL NVARCHAR(500) NULL,       -- Capturas de transferencias
    FechaPago      DATETIME      NULL,
    CONSTRAINT PK_PAGOS PRIMARY KEY (PagoID),
    CONSTRAINT FK_PAGOS_PEDIDOS FOREIGN KEY (PedidoID)
        REFERENCES PEDIDOS (PedidoID),
    CONSTRAINT FK_PAGOS_METODOS_PAGO FOREIGN KEY (MetodoPagoID)
        REFERENCES METODOS_PAGO (MetodoPagoID)
);

-- TABLA: RESEÑAS
CREATE TABLE RESENAS (
    ResenaID    INT           NOT NULL,
    PedidoID    INT           NOT NULL,
    Puntuacion  INT           NOT NULL,  -- De 1 a 5 (estrellas)
    Comentario  NVARCHAR(500) NULL,
    FechaResena DATETIME      NOT NULL,
    CONSTRAINT PK_RESENAS PRIMARY KEY (ResenaID),
    CONSTRAINT FK_RESENAS_PEDIDOS FOREIGN KEY (PedidoID)
        REFERENCES PEDIDOS (PedidoID),
    CONSTRAINT CHK_RESENAS_PUNTUACION CHECK (Puntuacion BETWEEN 1 AND 5)
);

-- TABLA: ENVIOS
CREATE TABLE ENVIOS (
    EnvioID      INT      NOT NULL,
    PedidoID     INT      NOT NULL,
    UsuarioID    INT      NOT NULL,  -- Repartidor
    EstadoID     INT      NOT NULL,
    FechaInicio  DATETIME NOT NULL,
    FechaEntrega DATETIME NULL,
    CONSTRAINT PK_ENVIOS PRIMARY KEY (EnvioID),
    CONSTRAINT FK_ENVIOS_PEDIDOS FOREIGN KEY (PedidoID)
        REFERENCES PEDIDOS (PedidoID),
    CONSTRAINT FK_ENVIOS_USUARIOS FOREIGN KEY (UsuarioID)
        REFERENCES USUARIOS (UsuarioID),
    CONSTRAINT FK_ENVIOS_ESTADO_ENVIO FOREIGN KEY (EstadoID)
        REFERENCES ESTADO_ENVIO (EstadoID)
);

-- TABLA: HISTORIAL_PEDIDOS
CREATE TABLE HISTORIAL_PEDIDOS (
    HistorialID    INT      NOT NULL,
    PedidoID       INT      NOT NULL,
    EstadoPedidoID INT      NOT NULL,
    FechaCambio    DATETIME NOT NULL,  -- Trazabilidad de la orden
    CONSTRAINT PK_HISTORIAL_PEDIDOS PRIMARY KEY (HistorialID),
    CONSTRAINT FK_HISTORIAL_PEDIDOS_PEDIDOS FOREIGN KEY (PedidoID)
        REFERENCES PEDIDOS (PedidoID),
    CONSTRAINT FK_HISTORIAL_PEDIDOS_ESTADOS_PEDIDO FOREIGN KEY (EstadoPedidoID)
        REFERENCES ESTADOS_PEDIDO (EstadoPedidoID)
);

-- TABLA: CARRITOS
CREATE TABLE CARRITOS (
    CarritoID          INT      NOT NULL,
    UsuarioID          INT      NOT NULL,
    SucursalID         INT      NOT NULL,
    FechaActualizacion DATETIME NOT NULL,  -- Limita el carrito a un solo local a la vez
    CONSTRAINT PK_CARRITOS PRIMARY KEY (CarritoID),
    CONSTRAINT FK_CARRITOS_USUARIOS FOREIGN KEY (UsuarioID)
        REFERENCES USUARIOS (UsuarioID),
    CONSTRAINT FK_CARRITOS_SUCURSALES FOREIGN KEY (SucursalID)
        REFERENCES SUCURSALES (SucursalID)
);

-- TABLA: CARRITO_ITEMS
CREATE TABLE CARRITO_ITEMS (
    ItemID     INT           NOT NULL,
    CarritoID  INT           NOT NULL,
    ProductoID INT           NOT NULL,
    Cantidad   INT           NOT NULL,
    Notas      NVARCHAR(300) NULL, 
    CONSTRAINT PK_CARRITO_ITEMS PRIMARY KEY (ItemID),
    CONSTRAINT FK_CARRITO_ITEMS_CARRITOS FOREIGN KEY (CarritoID)
        REFERENCES CARRITOS (CarritoID),
    CONSTRAINT FK_CARRITO_ITEMS_PRODUCTOS FOREIGN KEY (ProductoID)
        REFERENCES PRODUCTOS (ProductoID)
);


-- VISTAS

-- VISTA: V_PEDIDOS_COMPLETO
-- Detalle completo de cada pedido con usuario, sucursal,
-- estado actual y tipo de entrega
CREATE VIEW V_PEDIDOS_COMPLETO AS
SELECT
    p.PedidoID,
    p.FechaPedido,
    p.Subtotal,
    p.CostoEnvio,
    p.MontoTotal,
    u.UsuarioID,
    u.NombreUsuario,
    u.Email,
    s.SucursalID,
    s.DireccionDesc    AS DireccionSucursal,
    r.NombreRestaurante,
    ep.EstadoSTR       AS EstadoPedido,
    te.TipoEntregaSTR  AS TipoEntrega,
    du.Descripcion     AS DireccionEntrega
FROM PEDIDOS p
    INNER JOIN USUARIOS          u  ON p.UsuarioID          = u.UsuarioID
    INNER JOIN SUCURSALES        s  ON p.SucursalID         = s.SucursalID
    INNER JOIN RESTAURANTES      r  ON s.RestauranteID      = r.RestauranteID
    INNER JOIN ESTADOS_PEDIDO    ep ON p.EstadoPedidoID     = ep.EstadoPedidoID
    INNER JOIN TIPO_ENTREGA      te ON p.TipoEntregaID      = te.TipoEntregaID
    LEFT  JOIN DIRECCION_USUARIOS du ON p.DireccionUsuarioID = du.DireccionUsuarioID;
GO

-- VISTA: V_DETALLE_PEDIDO_PRODUCTOS
-- Items de cada pedido con nombre de producto y categoria
CREATE VIEW V_DETALLE_PEDIDO_PRODUCTOS AS
SELECT
    dp.DetalleID,
    dp.PedidoID,
    dp.Cantidad,
    dp.PrecioUnitario,
    dp.PrecioFinal,
    dp.Notas,
    pr.ProductoID,
    pr.NombreProducto,
    pr.ImagenURL,
    c.NombreCategoria
FROM DETALLE_PEDIDO dp
    INNER JOIN PRODUCTOS  pr ON dp.ProductoID  = pr.ProductoID
    INNER JOIN CATEGORIAS c  ON pr.CategoriaID = c.CategoriaID;
GO

-- VISTA: V_MENU_SUCURSAL
-- Productos activos con stock disponible por sucursal
CREATE VIEW V_MENU_SUCURSAL AS
SELECT
    pr.ProductoID,
    pr.NombreProducto,
    pr.Descripcion,
    pr.ImagenURL,
    pr.Precio,
    pr.Stock,
    c.NombreCategoria,
    s.SucursalID,
    s.DireccionDesc  AS DireccionSucursal,
    r.RestauranteID,
    r.NombreRestaurante
FROM PRODUCTOS pr
    INNER JOIN CATEGORIAS   c ON pr.CategoriaID   = c.CategoriaID
    INNER JOIN SUCURSALES   s ON pr.SucursalID    = s.SucursalID
    INNER JOIN RESTAURANTES r ON s.RestauranteID  = r.RestauranteID
WHERE pr.Activo = 1
  AND pr.Stock  > 0
  AND s.Activo  = 1
  AND s.EstaAbierto = 1;
GO

-- VISTA: V_HISTORIAL_ESTADOS
-- Timeline de cambios de estado por pedido
CREATE VIEW V_HISTORIAL_ESTADOS AS
SELECT
    hp.HistorialID,
    hp.PedidoID,
    hp.FechaCambio,
    ep.EstadoSTR AS Estado,
    u.NombreUsuario,
    u.Email
FROM HISTORIAL_PEDIDOS hp
    INNER JOIN ESTADOS_PEDIDO ep ON hp.EstadoPedidoID = ep.EstadoPedidoID
    INNER JOIN PEDIDOS        p  ON hp.PedidoID       = p.PedidoID
    INNER JOIN USUARIOS       u  ON p.UsuarioID       = u.UsuarioID;
GO

-- VISTA: V_RESUMEN_RESTAURANTE
-- Rating promedio y total de pedidos por restaurante
CREATE VIEW V_RESUMEN_RESTAURANTE AS
SELECT
    r.RestauranteID,
    r.NombreRestaurante,
    r.LogoURL,
    r.Descripcion,
    s.SucursalID,
    s.DireccionDesc             AS DireccionSucursal,
    s.EstaAbierto,
    COUNT(DISTINCT p.PedidoID)  AS TotalPedidos,
    AVG(CAST(re.Puntuacion AS FLOAT)) AS PromedioRating,
    COUNT(DISTINCT re.ResenaID) AS TotalResenas
FROM RESTAURANTES r
    INNER JOIN SUCURSALES s  ON r.RestauranteID = s.RestauranteID
    LEFT  JOIN PEDIDOS    p  ON s.SucursalID    = p.SucursalID
    LEFT  JOIN RESENAS    re ON p.PedidoID      = re.PedidoID
WHERE r.Activo = 1
GROUP BY
    r.RestauranteID,
    r.NombreRestaurante,
    r.LogoURL,
    r.Descripcion,
    s.SucursalID,
    s.DireccionDesc,
    s.EstaAbierto;
GO


-- TRIGGERS

-- TRIGGER: TRG_PEDIDOS_HISTORIAL
-- Registra automaticamente en HISTORIAL_PEDIDOS cada vez
-- que se inserta un pedido o cambia su EstadoPedidoID
CREATE TRIGGER TRG_PEDIDOS_HISTORIAL
ON PEDIDOS
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Solo actua si el EstadoPedidoID cambio (o es un INSERT nuevo)
    IF UPDATE(EstadoPedidoID)
    BEGIN
        INSERT INTO HISTORIAL_PEDIDOS (HistorialID, PedidoID, EstadoPedidoID, FechaCambio)
        SELECT
            -- Genera un ID unico combinando PedidoID + timestamp 
            ABS(CHECKSUM(NEWID())),
            i.PedidoID,
            i.EstadoPedidoID,
            GETDATE()
        FROM inserted i;
    END
END;
GO

-- TRIGGER: TRG_DETALLE_PEDIDO_STOCK
-- Descuenta el Stock en PRODUCTOS al confirmar
-- los items de un pedido
CREATE TRIGGER TRG_DETALLE_PEDIDO_STOCK
ON DETALLE_PEDIDO
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Verifica que haya stock suficiente antes de descontar
    IF EXISTS (
        SELECT 1
        FROM inserted i
            INNER JOIN PRODUCTOS pr ON i.ProductoID = pr.ProductoID
        WHERE pr.Stock < i.Cantidad
    )
    BEGIN
        RAISERROR('Stock insuficiente para uno o mas productos del pedido.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Descuenta el stock
    UPDATE pr
    SET pr.Stock = pr.Stock - i.Cantidad
    FROM PRODUCTOS pr
        INNER JOIN inserted i ON pr.ProductoID = i.ProductoID;
END;
GO

-- TRIGGER: TRG_CARRITO_SUCURSAL_UNICA
-- Impide agregar al carrito productos de una sucursal
-- diferente a la que ya tiene el carrito activo
CREATE TRIGGER TRG_CARRITO_SUCURSAL_UNICA
ON CARRITO_ITEMS
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Compara la sucursal del carrito con la sucursal del producto nuevo
    IF EXISTS (
        SELECT 1
        FROM inserted i
            INNER JOIN CARRITOS  ca ON i.CarritoID  = ca.CarritoID
            INNER JOIN PRODUCTOS pr ON i.ProductoID = pr.ProductoID
        WHERE ca.SucursalID <> pr.SucursalID
    )
    BEGIN
        RAISERROR('No puedes agregar productos de distintas sucursales al mismo carrito.', 16, 1);
        RETURN;
    END

    -- Si pasa la validacion, realiza el INSERT normal
    INSERT INTO CARRITO_ITEMS (ItemID, CarritoID, ProductoID, Cantidad, Notas)
    SELECT ItemID, CarritoID, ProductoID, Cantidad, Notas
    FROM inserted;
END;
GO

-- TRIGGER: TRG_RESENA_VALIDAR_PEDIDO
-- Impide insertar una resena si el pedido no tiene
-- el estado correspondiente a "Entregado" (EstadoPedidoID = 4)
-- Ajusta el valor 4 segun tus datos en ESTADOS_PEDIDO
CREATE TRIGGER TRG_RESENA_VALIDAR_PEDIDO
ON RESENAS
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
            INNER JOIN PEDIDOS p ON i.PedidoID = p.PedidoID
        WHERE p.EstadoPedidoID <> 4  -- 4 = Entregado
    )
    BEGIN
        RAISERROR('Solo puedes resenar un pedido que ya fue entregado.', 16, 1);
        RETURN;
    END

    INSERT INTO RESENAS (ResenaID, PedidoID, Puntuacion, Comentario, FechaResena)
    SELECT ResenaID, PedidoID, Puntuacion, Comentario, FechaResena
    FROM inserted;
END;
GO

-- TRIGGER: TRG_ENVIO_SOLO_REPARTIDOR
-- Valida que el usuario asignado a un envio tenga RolID = 2
-- (Repartidor) antes de permitir el INSERT
CREATE TRIGGER TRG_ENVIO_SOLO_REPARTIDOR
ON ENVIOS
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
            INNER JOIN USUARIOS u ON i.UsuarioID = u.UsuarioID
        WHERE u.RolID <> 2  -- 2 = Repartidor
    )
    BEGIN
        RAISERROR('El usuario asignado al envio debe tener el rol de Repartidor.', 16, 1);
        RETURN;
    END

    INSERT INTO ENVIOS (EnvioID, PedidoID, UsuarioID, EstadoID, FechaInicio, FechaEntrega)
    SELECT EnvioID, PedidoID, UsuarioID, EstadoID, FechaInicio, FechaEntrega
    FROM inserted;
END;
GO
