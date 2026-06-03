package models

import "time"

type EstadoPedido struct {
	EstadoPedidoID uint   `gorm:"primaryKey" json:"estado_pedido_id"`
	EstadoSTR      string `gorm:"not null"   json:"estado_str"`
}

type EstadoEnvio struct {
	EstadoID  uint   `gorm:"primaryKey" json:"estado_id"`
	EstadoSTR string `gorm:"not null"   json:"estado_str"`
}

type Pedido struct {
	PedidoID           uint      `gorm:"primaryKey"     json:"pedido_id"`
	UsuarioID          uint      `gorm:"not null"       json:"usuario_id"`
	SucursalID         uint      `gorm:"not null"       json:"sucursal_id"`
	DireccionUsuarioID uint      `                      json:"direccion_id"`
	TipoEntregaID      uint      `                      json:"tipo_entrega_id"`
	EstadoPedidoID     uint      `gorm:"not null"       json:"estado_pedido_id"`
	Subtotal           float64   `gorm:"not null"       json:"subtotal"`
	CostoEnvio         float64   `gorm:"not null"       json:"costo_envio"`
	MontoTotal         float64   `gorm:"not null"       json:"monto_total"`
	FechaPedido        time.Time `gorm:"autoCreateTime" json:"fecha_pedido"`
}

type DetallePedido struct {
	DetalleID      uint    `gorm:"primaryKey" json:"detalle_id"`
	PedidoID       uint    `gorm:"not null"   json:"pedido_id"`
	ProductoID     uint    `gorm:"not null"   json:"producto_id"`
	Cantidad       int     `gorm:"not null"   json:"cantidad"`
	PrecioUnitario float64 `gorm:"not null"   json:"precio_unitario"`
	PrecioFinal    float64 `gorm:"not null"   json:"precio_final"`
	Notas          string  `                  json:"notas"`
}

type Envio struct {
	EnvioID      uint       `gorm:"primaryKey"     json:"envio_id"`
	PedidoID     uint       `gorm:"not null"       json:"pedido_id"`
	UsuarioID    uint       `                      json:"usuario_id"`
	EstadoID     uint       `gorm:"not null"       json:"estado_id"`
	FechaInicio  *time.Time `                      json:"fecha_inicio"`
	FechaEntrega *time.Time `                      json:"fecha_entrega"`
}

type Pago struct {
	PagoID         uint       `gorm:"primaryKey"     json:"pago_id"`
	PedidoID       uint       `gorm:"not null"       json:"pedido_id"`
	MetodoPagoID   uint       `gorm:"not null"       json:"metodo_pago_id"`
	Monto          float64    `gorm:"not null"       json:"monto"`
	EstadoPago     string     `gorm:"not null"       json:"estado_pago"`
	ComprobanteURL string     `                      json:"comprobante_url"`
	FechaPago      *time.Time `                      json:"fecha_pago"`
}

type HistorialPedidoEstado struct {
	HistorialID    uint      `gorm:"primaryKey"     json:"historial_id"`
	PedidoID       uint      `gorm:"not null"       json:"pedido_id"`
	EstadoPedidoID uint      `                      json:"estado_pedido_id"`
	FechaCambio    time.Time `gorm:"autoCreateTime" json:"fecha_cambio"`
}
