package models

import "time"

// ── Catálogos de estado ───────────────────────────────────────────────────────

type EstadoPedido struct {
	EstadoPedidoID uint   `gorm:"primaryKey" json:"estado_pedido_id"`
	EstadoSTR      string `gorm:"not null"   json:"estado_str"`
	// 1=Recibido, 2=En Preparación, 3=Listo/En Camino, 4=Entregado
}

type EstadoEnvio struct {
	EstadoID  uint   `gorm:"primaryKey" json:"estado_id"`
	EstadoSTR string `gorm:"not null"   json:"estado_str"`
}

// ── Pedido principal ─────────────────────────────────────────────────────────

type Pedido struct {
	PedidoID           uint      `gorm:"primaryKey"                      json:"pedido_id"`
	CodigoExterno      string    `gorm:"size:20;uniqueIndex"             json:"id"`           // "AG-482910"
	UsuarioID          uint      `gorm:"not null"                        json:"usuario_id"`
	SucursalID         uint      `gorm:"not null"                        json:"sucursal_id"`
	RestaurantNombre   string    `gorm:"size:100"                        json:"restaurant"`   // "Piedra Negra"
	DireccionUsuarioID uint      `                                       json:"direccion_id"`
	TipoEntregaID      uint      `                                       json:"tipo_entrega_id"`

	// Estado: 0=Recibido, 1=En Preparación, 2=Listo/En Camino, 3=Entregado
	Status             int       `gorm:"not null;default:0"              json:"status"`
	EstadoPedidoID     uint      `                                       json:"estado_pedido_id"`

	// Financiero
	Subtotal           float64   `gorm:"not null"                        json:"subtotal"`
	CostoEnvio         float64   `gorm:"not null;default:0"              json:"deliveryFee"`
	Descuento          float64   `gorm:"default:0"                       json:"discount"`
	Impuesto           float64   `gorm:"default:0"                       json:"tax"`
	MontoTotal         float64   `gorm:"not null"                        json:"total"`
	Cupon              string    `gorm:"size:50"                         json:"coupon"`

	// Repartidor asignado
	RepartidorNombre   string    `gorm:"size:100"                        json:"driverName"`

	FechaPedido        time.Time `gorm:"autoCreateTime"                  json:"createdAt"`

	// Relaciones
	Detalles           []DetallePedido  `gorm:"foreignKey:PedidoID"        json:"items"`
	EntregaDetalle     *EntregaDetalle  `gorm:"foreignKey:PedidoID"        json:"deliveryDetails"`
	Pago               *Pago            `gorm:"foreignKey:PedidoID"        json:"pago,omitempty"`
	Envio              *Envio           `gorm:"foreignKey:PedidoID"        json:"envio,omitempty"`
}

// ── Detalle de entrega (delivery o pickup) ───────────────────────────────────

type EntregaDetalle struct {
	EntregaID  uint   `gorm:"primaryKey"  json:"entrega_id"`
	PedidoID   uint   `gorm:"not null"    json:"pedido_id"`
	Method     string `gorm:"size:20"     json:"method"`     // "delivery" o "pickup"
	Faculty    string `gorm:"size:150"    json:"faculty"`    // "Facultad de Ciencias Técnicas"
	Floor      string `gorm:"size:50"     json:"floor"`      // "Piso 1"
	Classroom  string `gorm:"size:100"    json:"classroom"`  // "Aula 102"
	Notes      string `gorm:"size:500"    json:"notes"`
}

// ── Detalle de productos del pedido ─────────────────────────────────────────

type DetallePedido struct {
	DetalleID      uint    `gorm:"primaryKey" json:"detalle_id"`
	PedidoID       uint    `gorm:"not null"   json:"pedido_id"`
	ProductoID     uint    `gorm:"not null"   json:"producto_id"`  // FK lógico → catalogo
	NombreProducto string  `gorm:"size:200"   json:"name"`         // snapshot del nombre
	BadgeText      string  `gorm:"size:10"    json:"badgeText"`
	Cantidad       int     `gorm:"not null"   json:"quantity"`
	PrecioUnitario float64 `gorm:"not null"   json:"price"`
	PrecioFinal    float64 `gorm:"not null"   json:"precio_final"`
	Notas          string  `gorm:"size:500"   json:"notas"`
}

// ── Envío (repartidor) ────────────────────────────────────────────────────────

type Envio struct {
	EnvioID      uint       `gorm:"primaryKey"     json:"envio_id"`
	PedidoID     uint       `gorm:"not null"       json:"pedido_id"`
	UsuarioID    uint       `                      json:"usuario_id"`    // Repartidor
	EstadoID     uint       `gorm:"not null"       json:"estado_id"`
	FechaInicio  *time.Time `                      json:"fecha_inicio"`
	FechaEntrega *time.Time `                      json:"fecha_entrega"`
}

// ── Pago ─────────────────────────────────────────────────────────────────────

type Pago struct {
	PagoID         uint       `gorm:"primaryKey"     json:"pago_id"`
	PedidoID       uint       `gorm:"not null"       json:"pedido_id"`
	MetodoPagoID   uint       `gorm:"not null"       json:"metodo_pago_id"`
	Monto          float64    `gorm:"not null"       json:"monto"`
	EstadoPago     string     `gorm:"not null"       json:"estado_pago"`   // Pendiente, Completado
	ComprobanteURL string     `                      json:"comprobante_url"`
	FechaPago      *time.Time `                      json:"fecha_pago"`
}

// ── Historial de cambios de estado ───────────────────────────────────────────

type HistorialPedidoEstado struct {
	HistorialID    uint      `gorm:"primaryKey"     json:"historial_id"`
	PedidoID       uint      `gorm:"not null"       json:"pedido_id"`
	EstadoPedidoID uint      `                      json:"estado_pedido_id"`
	Status         int       `                      json:"status"`
	FechaCambio    time.Time `gorm:"autoCreateTime" json:"fecha_cambio"`
}
