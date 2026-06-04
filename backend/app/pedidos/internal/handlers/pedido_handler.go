package handlers

import (
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/ajigo/pedidos/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PedidoHandler struct {
	db *gorm.DB
}

func NewPedidoHandler(db *gorm.DB) *PedidoHandler {
	return &PedidoHandler{db: db}
}

// ── DTOs de entrada ───────────────────────────────────────────────────────────

type itemRequest struct {
	ProductoID     uint    `json:"producto_id"`
	Name           string  `json:"name"           binding:"required"`
	BadgeText      string  `json:"badgeText"`
	Price          float64 `json:"price"          binding:"required"`
	Quantity       int     `json:"quantity"       binding:"required,min=1"`
	Notas          string  `json:"notas"`
}

type deliveryDetailsRequest struct {
	Method    string `json:"method"`     // "delivery" o "pickup"
	Faculty   string `json:"faculty"`
	Floor     string `json:"floor"`
	Classroom string `json:"classroom"`
	Notes     string `json:"notes"`
}

type crearPedidoRequest struct {
	UsuarioID       uint                   `json:"usuario_id"      binding:"required"`
	SucursalID      uint                   `json:"sucursal_id"     binding:"required"`
	RestaurantName  string                 `json:"restaurant"`
	MetodoPagoID    uint                   `json:"metodo_pago_id"  binding:"required"`
	Items           []itemRequest          `json:"items"           binding:"required,min=1"`
	Subtotal        float64                `json:"subtotal"        binding:"required"`
	DeliveryFee     float64                `json:"deliveryFee"`
	Discount        float64                `json:"discount"`
	Tax             float64                `json:"tax"`
	Total           float64                `json:"total"           binding:"required"`
	Coupon          string                 `json:"coupon"`
	DeliveryDetails deliveryDetailsRequest `json:"deliveryDetails"`
}

// ── Generador de código externo "AG-XXXXXX" ──────────────────────────────────

func generarCodigo() string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprintf("AG-%06d", rand.Intn(900000)+100000)
}

// ── POST /pedidos ─────────────────────────────────────────────────────────────

func (h *PedidoHandler) CrearPedido(c *gin.Context) {
	var req crearPedidoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var pedidoCreado models.Pedido

	err := h.db.Transaction(func(tx *gorm.DB) error {

		// 1. Crear pedido
		pedido := models.Pedido{
			CodigoExterno:    generarCodigo(),
			UsuarioID:        req.UsuarioID,
			SucursalID:       req.SucursalID,
			RestaurantNombre: req.RestaurantName,
			Status:           0, // Recibido
			EstadoPedidoID:   1,
			Subtotal:         req.Subtotal,
			CostoEnvio:       req.DeliveryFee,
			Descuento:        req.Discount,
			Impuesto:         req.Tax,
			MontoTotal:       req.Total,
			Cupon:            req.Coupon,
		}
		if err := tx.Create(&pedido).Error; err != nil {
			return err
		}

		// 2. Detalles de entrega
		entrega := models.EntregaDetalle{
			PedidoID:  pedido.PedidoID,
			Method:    req.DeliveryDetails.Method,
			Faculty:   req.DeliveryDetails.Faculty,
			Floor:     req.DeliveryDetails.Floor,
			Classroom: req.DeliveryDetails.Classroom,
			Notes:     req.DeliveryDetails.Notes,
		}
		if err := tx.Create(&entrega).Error; err != nil {
			return err
		}

		// 3. Items del pedido
		for _, item := range req.Items {
			detalle := models.DetallePedido{
				PedidoID:       pedido.PedidoID,
				ProductoID:     item.ProductoID,
				NombreProducto: item.Name,
				BadgeText:      item.BadgeText,
				Cantidad:       item.Quantity,
				PrecioUnitario: item.Price,
				PrecioFinal:    item.Price * float64(item.Quantity),
				Notas:          item.Notas,
			}
			if err := tx.Create(&detalle).Error; err != nil {
				return err
			}
		}

		// 4. Pago
		pago := models.Pago{
			PedidoID:     pedido.PedidoID,
			MetodoPagoID: req.MetodoPagoID,
			Monto:        req.Total,
			EstadoPago:   "Pendiente",
		}
		if err := tx.Create(&pago).Error; err != nil {
			return err
		}

		// 5. Primer registro en historial
		historial := models.HistorialPedidoEstado{
			PedidoID:       pedido.PedidoID,
			EstadoPedidoID: 1,
			Status:         0,
		}
		if err := tx.Create(&historial).Error; err != nil {
			return err
		}

		pedidoCreado = pedido
		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Cargar relaciones para la respuesta
	h.db.Preload("Detalles").
		Preload("EntregaDetalle").
		Preload("Pago").
		First(&pedidoCreado, pedidoCreado.PedidoID)

	c.JSON(http.StatusCreated, pedidoCreado)
}

// ── GET /pedidos/:id ──────────────────────────────────────────────────────────

func (h *PedidoHandler) GetPedido(c *gin.Context) {
	id := c.Param("id")
	var pedido models.Pedido

	// Soporta buscar por ID numérico o por código "AG-XXXXXX"
	query := h.db.Preload("Detalles").
		Preload("EntregaDetalle").
		Preload("Pago").
		Preload("Envio")

	numID, err := strconv.Atoi(id)
	if err == nil {
		query = query.First(&pedido, numID)
	} else {
		query = query.Where("codigo_externo = ?", id).First(&pedido)
	}

	if query.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Pedido no encontrado"})
		return
	}
	c.JSON(http.StatusOK, pedido)
}

// ── GET /pedidos/usuario/:usuario_id ─────────────────────────────────────────

func (h *PedidoHandler) GetPedidosPorUsuario(c *gin.Context) {
	usuarioID, _ := strconv.Atoi(c.Param("usuario_id"))
	var pedidos []models.Pedido
	h.db.Preload("Detalles").
		Preload("EntregaDetalle").
		Where("usuario_id = ?", usuarioID).
		Order("fecha_pedido desc").
		Find(&pedidos)
	c.JSON(http.StatusOK, pedidos)
}

// ── PATCH /pedidos/:id/estado ────────────────────────────────────────────────
// Usado por RestaurantAdmin para avanzar el estado del pedido

func (h *PedidoHandler) ActualizarEstado(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var body struct {
		Status         int  `json:"status"          binding:"min=0,max=3"`
		EstadoPedidoID uint `json:"estado_pedido_id"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.db.Transaction(func(tx *gorm.DB) error {
		updates := map[string]interface{}{
			"status":           body.Status,
			"estado_pedido_id": body.EstadoPedidoID,
		}
		if err := tx.Model(&models.Pedido{}).
			Where("pedido_id = ?", id).
			Updates(updates).Error; err != nil {
			return err
		}
		return tx.Create(&models.HistorialPedidoEstado{
			PedidoID:       uint(id),
			EstadoPedidoID: body.EstadoPedidoID,
			Status:         body.Status,
		}).Error
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"mensaje": "Estado actualizado"})
}

// ── PATCH /pedidos/:id/repartidor ─────────────────────────────────────────────
// Usado por DriverPortal para asignarse a un pedido

func (h *PedidoHandler) AsignarRepartidor(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var body struct {
		RepartidorNombre string `json:"driver_name" binding:"required"`
		RepartidorID     uint   `json:"usuario_id"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.db.Transaction(func(tx *gorm.DB) error {
		// Actualizar nombre del repartidor en el pedido
		if err := tx.Model(&models.Pedido{}).
			Where("pedido_id = ?", id).
			Update("repartidor_nombre", body.RepartidorNombre).Error; err != nil {
			return err
		}

		// Crear o actualizar envío
		envio := models.Envio{
			PedidoID:  uint(id),
			UsuarioID: body.RepartidorID,
			EstadoID:  2, // En Camino
		}
		return tx.Where("pedido_id = ?", id).
			Assign(envio).
			FirstOrCreate(&envio).Error
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"mensaje": "Repartidor asignado"})
}

// ── GET /pedidos/pendientes ───────────────────────────────────────────────────
// Usados por DriverPortal para ver pedidos disponibles para recoger

func (h *PedidoHandler) GetPedidosPendientes(c *gin.Context) {
	var pedidos []models.Pedido
	// Status 2 = Listo/En Camino (listo para que el repartidor recoja)
	h.db.Preload("Detalles").
		Preload("EntregaDetalle").
		Where("status = ? AND repartidor_nombre = ''", 2).
		Order("fecha_pedido asc").
		Find(&pedidos)
	c.JSON(http.StatusOK, pedidos)
}

// ── GET /pedidos/sucursal/:sucursal_id ────────────────────────────────────────
// Usado por RestaurantAdmin para ver todos los pedidos de un restaurante

func (h *PedidoHandler) GetPedidosPorSucursal(c *gin.Context) {
	sucursalID, _ := strconv.Atoi(c.Param("sucursal_id"))
	var pedidos []models.Pedido
	h.db.Preload("Detalles").
		Preload("EntregaDetalle").
		Preload("Pago").
		Where("sucursal_id = ?", sucursalID).
		Order("fecha_pedido desc").
		Find(&pedidos)
	c.JSON(http.StatusOK, pedidos)
}

// ── GET /estados ──────────────────────────────────────────────────────────────

func (h *PedidoHandler) GetEstados(c *gin.Context) {
	var estados []models.EstadoPedido
	h.db.Find(&estados)
	c.JSON(http.StatusOK, estados)
}

// ── GET /health ───────────────────────────────────────────────────────────────

func (h *PedidoHandler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "pedidos"})
}

// ── Registro de rutas ─────────────────────────────────────────────────────────

func (h *PedidoHandler) RegisterRoutes(r *gin.Engine) {
	r.GET("/health", h.Health)
	r.GET("/estados", h.GetEstados)

	r.POST("/pedidos", h.CrearPedido)
	r.GET("/pedidos/:id", h.GetPedido)
	r.PATCH("/pedidos/:id/estado", h.ActualizarEstado)
	r.PATCH("/pedidos/:id/repartidor", h.AsignarRepartidor)

	r.GET("/pedidos/usuario/:usuario_id", h.GetPedidosPorUsuario)
	r.GET("/pedidos/sucursal/:sucursal_id", h.GetPedidosPorSucursal)
	r.GET("/pedidos/pendientes", h.GetPedidosPendientes)
}package handlers

import (
	"net/http"
	"strconv"

	"github.com/ajigo/pedidos/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PedidoHandler struct {
	db *gorm.DB
}

func NewPedidoHandler(db *gorm.DB) *PedidoHandler {
	return &PedidoHandler{db: db}
}

// ── DTOs ──────────────────────────────────────────────────────────────────────

type crearPedidoRequest struct {
	UsuarioID          uint                    `json:"usuario_id"          binding:"required"`
	SucursalID         uint                    `json:"sucursal_id"         binding:"required"`
	DireccionUsuarioID uint                    `json:"direccion_id"`
	TipoEntregaID      uint                    `json:"tipo_entrega_id"`
	CostoEnvio         float64                 `json:"costo_envio"`
	MetodoPagoID       uint                    `json:"metodo_pago_id"      binding:"required"`
	Detalles           []detalleRequest        `json:"detalles"            binding:"required,min=1"`
}

type detalleRequest struct {
	ProductoID     uint    `json:"producto_id"     binding:"required"`
	Cantidad       int     `json:"cantidad"        binding:"required,min=1"`
	PrecioUnitario float64 `json:"precio_unitario" binding:"required"`
	Notas          string  `json:"notas"`
}

// ── Handlers ──────────────────────────────────────────────────────────────────

// POST /pedidos  — crea pedido + detalles + pago en una transacción
func (h *PedidoHandler) CrearPedido(c *gin.Context) {
	var req crearPedidoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var subtotal float64
	for _, d := range req.Detalles {
		subtotal += d.PrecioUnitario * float64(d.Cantidad)
	}
	montoTotal := subtotal + req.CostoEnvio

	var pedidoCreado models.Pedido

	err := h.db.Transaction(func(tx *gorm.DB) error {
		pedido := models.Pedido{
			UsuarioID:          req.UsuarioID,
			SucursalID:         req.SucursalID,
			DireccionUsuarioID: req.DireccionUsuarioID,
			TipoEntregaID:      req.TipoEntregaID,
			EstadoPedidoID:     1, // 1 = Preparando
			Subtotal:           subtotal,
			CostoEnvio:         req.CostoEnvio,
			MontoTotal:         montoTotal,
		}
		if err := tx.Create(&pedido).Error; err != nil {
			return err
		}

		for _, d := range req.Detalles {
			detalle := models.DetallePedido{
				PedidoID:       pedido.PedidoID,
				ProductoID:     d.ProductoID,
				Cantidad:       d.Cantidad,
				PrecioUnitario: d.PrecioUnitario,
				PrecioFinal:    d.PrecioUnitario * float64(d.Cantidad),
				Notas:          d.Notas,
			}
			if err := tx.Create(&detalle).Error; err != nil {
				return err
			}
		}

		pago := models.Pago{
			PedidoID:     pedido.PedidoID,
			MetodoPagoID: req.MetodoPagoID,
			Monto:        montoTotal,
			EstadoPago:   "Pendiente",
		}
		if err := tx.Create(&pago).Error; err != nil {
			return err
		}

		// Registrar en historial
		historial := models.HistorialPedidoEstado{
			PedidoID:       pedido.PedidoID,
			EstadoPedidoID: 1,
		}
		if err := tx.Create(&historial).Error; err != nil {
			return err
		}

		pedidoCreado = pedido
		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	h.db.Preload("Detalles").Preload("Pago").Preload("Estado").First(&pedidoCreado, pedidoCreado.PedidoID)
	c.JSON(http.StatusCreated, pedidoCreado)
}

// GET /pedidos/:id
func (h *PedidoHandler) GetPedido(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var pedido models.Pedido
	if err := h.db.Preload("Detalles").Preload("Pago").Preload("Estado").
		Preload("Envio").First(&pedido, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Pedido no encontrado"})
		return
	}
	c.JSON(http.StatusOK, pedido)
}

// GET /pedidos/usuario/:usuario_id
func (h *PedidoHandler) GetPedidosPorUsuario(c *gin.Context) {
	usuarioID, _ := strconv.Atoi(c.Param("usuario_id"))
	var pedidos []models.Pedido
	h.db.Preload("Estado").Where("usuario_id = ?", usuarioID).
		Order("fecha_pedido desc").Find(&pedidos)
	c.JSON(http.StatusOK, pedidos)
}

// PATCH /pedidos/:id/estado
func (h *PedidoHandler) ActualizarEstado(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var body struct {
		EstadoPedidoID uint `json:"estado_pedido_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.Pedido{}).Where("pedido_id = ?", id).
			Update("estado_pedido_id", body.EstadoPedidoID).Error; err != nil {
			return err
		}
		return tx.Create(&models.HistorialPedidoEstado{
			PedidoID:       uint(id),
			EstadoPedidoID: body.EstadoPedidoID,
		}).Error
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"mensaje": "Estado actualizado"})
}

// GET /health
func (h *PedidoHandler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "pedidos"})
}

func (h *PedidoHandler) RegisterRoutes(r *gin.Engine) {
	r.GET("/health", h.Health)
	r.POST("/pedidos", h.CrearPedido)
	r.GET("/pedidos/:id", h.GetPedido)
	r.GET("/pedidos/usuario/:usuario_id", h.GetPedidosPorUsuario)
	r.PATCH("/pedidos/:id/estado", h.ActualizarEstado)
}
