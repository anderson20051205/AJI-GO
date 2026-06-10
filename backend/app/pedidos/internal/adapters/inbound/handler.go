package inbound

import (
	"net/http"
	"strconv"

	"github.com/ajigo/pedidos/internal/application"
	"github.com/gin-gonic/gin"
)

type PedidoHandler struct {
	Service *application.PedidoService
}

// ── DTOs HTTP ─────────────────────────────────────────────────────────────────

type itemRequest struct {
	ProductoID int     `json:"producto_id"`
	Name       string  `json:"name"     binding:"required"`
	BadgeText  string  `json:"badgeText"`
	Price      float64 `json:"price"    binding:"required"`
	Quantity   int     `json:"quantity" binding:"required,min=1"`
	Notas      string  `json:"notas"`
}

type entregaRequest struct {
	Method    string `json:"method"`
	Faculty   string `json:"faculty"`
	Floor     string `json:"floor"`
	Classroom string `json:"classroom"`
	Notes     string `json:"notes"`
}

type crearPedidoRequest struct {
	UsuarioID      int            `json:"usuario_id"     binding:"required"`
	SucursalID     int            `json:"sucursal_id"    binding:"required"`
	RestaurantName string         `json:"restaurant"`
	MetodoPagoID   int            `json:"metodo_pago_id" binding:"required"`
	Items          []itemRequest  `json:"items"          binding:"required,min=1"`
	Subtotal       float64        `json:"subtotal"       binding:"required"`
	DeliveryFee    float64        `json:"deliveryFee"`
	Discount       float64        `json:"discount"`
	Tax            float64        `json:"tax"`
	Total          float64        `json:"total"          binding:"required"`
	Coupon         string         `json:"coupon"`
	Entrega        entregaRequest `json:"deliveryDetails"`
}

type actualizarEstadoRequest struct {
	Status         int `json:"status"`
	EstadoPedidoID int `json:"estado_pedido_id"`
}

type asignarRepartidorRequest struct {
	RepartidorNombre string `json:"driver_name" binding:"required"`
	UsuarioID        int    `json:"usuario_id"`
}

// ── POST /api/pedidos ─────────────────────────────────────────────────────────

func (h *PedidoHandler) CrearPedido(c *gin.Context) {
	var req crearPedidoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var items []application.ItemInput
	for _, it := range req.Items {
		items = append(items, application.ItemInput{
			ProductoID: it.ProductoID,
			Name:       it.Name,
			BadgeText:  it.BadgeText,
			Price:      it.Price,
			Quantity:   it.Quantity,
			Notas:      it.Notas,
		})
	}

	input := application.CrearPedidoInput{
		UsuarioID:      req.UsuarioID,
		SucursalID:     req.SucursalID,
		RestaurantName: req.RestaurantName,
		MetodoPagoID:   req.MetodoPagoID,
		Items:          items,
		Subtotal:       req.Subtotal,
		DeliveryFee:    req.DeliveryFee,
		Discount:       req.Discount,
		Tax:            req.Tax,
		Total:          req.Total,
		Coupon:         req.Coupon,
		Entrega: application.EntregaInput{
			Method:    req.Entrega.Method,
			Faculty:   req.Entrega.Faculty,
			Floor:     req.Entrega.Floor,
			Classroom: req.Entrega.Classroom,
			Notes:     req.Entrega.Notes,
		},
	}

	pedido, err := h.Service.CrearPedido(input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, pedido)
}

// ── GET /api/pedidos/:id ──────────────────────────────────────────────────────

func (h *PedidoHandler) GetPedido(c *gin.Context) {
	pedido, err := h.Service.GetPedido(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, pedido)
}

// ── GET /api/pedidos/usuario/:usuario_id ──────────────────────────────────────

func (h *PedidoHandler) GetPedidosPorUsuario(c *gin.Context) {
	usuarioID, err := strconv.Atoi(c.Param("usuario_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "usuario_id inválido"})
		return
	}
	pedidos, err := h.Service.GetPedidosPorUsuario(usuarioID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, pedidos)
}

// ── GET /api/pedidos/sucursal/:sucursal_id ────────────────────────────────────

func (h *PedidoHandler) GetPedidosPorSucursal(c *gin.Context) {
	sucursalID, err := strconv.Atoi(c.Param("sucursal_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "sucursal_id inválido"})
		return
	}
	pedidos, err := h.Service.GetPedidosPorSucursal(sucursalID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, pedidos)
}

// ── GET /api/pedidos/pendientes ───────────────────────────────────────────────

func (h *PedidoHandler) GetPedidosPendientes(c *gin.Context) {
	pedidos, err := h.Service.GetPedidosPendientes()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, pedidos)
}

// ── PATCH /api/pedidos/:id/estado ─────────────────────────────────────────────

func (h *PedidoHandler) ActualizarEstado(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id inválido"})
		return
	}
	var req actualizarEstadoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.Service.ActualizarEstado(id, application.ActualizarEstadoInput{
		Status:         req.Status,
		EstadoPedidoID: req.EstadoPedidoID,
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"mensaje": "Estado actualizado"})
}

// ── PATCH /api/pedidos/:id/repartidor ─────────────────────────────────────────

func (h *PedidoHandler) AsignarRepartidor(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id inválido"})
		return
	}
	var req asignarRepartidorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.Service.AsignarRepartidor(id, application.AsignarRepartidorInput{
		RepartidorNombre: req.RepartidorNombre,
		UsuarioID:        req.UsuarioID,
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"mensaje": "Repartidor asignado"})
}

// ── GET /api/pedidos/estados ──────────────────────────────────────────────────

func (h *PedidoHandler) GetEstados(c *gin.Context) {
	estados, err := h.Service.GetEstados()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, estados)
}

// ── GET /health ───────────────────────────────────────────────────────────────

func (h *PedidoHandler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "pedidos"})
}

// ── Registro de rutas ─────────────────────────────────────────────────────────

func (h *PedidoHandler) RegisterRoutes(r *gin.Engine) {
	r.GET("/health", h.Health)
	r.GET("/api/pedidos/estados", h.GetEstados)
	r.GET("/api/pedidos/pendientes", h.GetPedidosPendientes)
	r.GET("/api/pedidos/usuario/:usuario_id", h.GetPedidosPorUsuario)
	r.GET("/api/pedidos/sucursal/:sucursal_id", h.GetPedidosPorSucursal)
	r.POST("/api/pedidos", h.CrearPedido)
	r.GET("/api/pedidos/:id", h.GetPedido)
	r.PATCH("/api/pedidos/:id/estado", h.ActualizarEstado)
	r.PATCH("/api/pedidos/:id/repartidor", h.AsignarRepartidor)
}
