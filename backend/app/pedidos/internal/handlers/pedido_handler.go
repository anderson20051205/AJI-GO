package handlers

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
