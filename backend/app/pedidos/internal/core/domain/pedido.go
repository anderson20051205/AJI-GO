package domain

import "time"

// ── Entidades de dominio ──────────────────────────────────────────────────────

type EstadoPedido struct {
	EstadoPedidoID int
	EstadoSTR      string
	// 1=Recibido, 2=En Preparación, 3=Listo/En Camino, 4=Entregado
}

type EstadoEnvio struct {
	EstadoID  int
	EstadoSTR string
}

type Pedido struct {
	PedidoID           int
	CodigoExterno      string    // "AG-482910"
	UsuarioID          int
	SucursalID         int
	RestaurantNombre   string
	DireccionUsuarioID int
	TipoEntregaID      int
	Status             int       // 0=Recibido, 1=En Preparación, 2=Listo/En Camino, 3=Entregado
	EstadoPedidoID     int
	Subtotal           float64
	CostoEnvio         float64
	Descuento          float64
	Impuesto           float64
	MontoTotal         float64
	Cupon              string
	RepartidorNombre   string
	FechaPedido        time.Time
	Detalles           []DetallePedido
	EntregaDetalle     *EntregaDetalle
	Pago               *Pago
}

type DetallePedido struct {
	DetalleID      int
	PedidoID       int
	ProductoID     int
	NombreProducto string  // snapshot del nombre
	BadgeText      string  // "PN", "EC", "CO", "UB"
	Cantidad       int
	PrecioUnitario float64
	PrecioFinal    float64
	Notas          string
}

type EntregaDetalle struct {
	EntregaID int
	PedidoID  int
	Method    string // "delivery" o "pickup"
	Faculty   string // "Facultad de Ciencias Técnicas"
	Floor     string
	Classroom string
	Notes     string
}

type Pago struct {
	PagoID         int
	PedidoID       int
	MetodoPagoID   int
	Monto          float64
	EstadoPago     string     // "Pendiente", "Completado"
	ComprobanteURL string
	FechaPago      *time.Time
}

type HistorialPedidoEstado struct {
	HistorialID    int
	PedidoID       int
	EstadoPedidoID int
	Status         int
	FechaCambio    time.Time
}

type Envio struct {
	EnvioID      int
	PedidoID     int
	UsuarioID    int
	EstadoID     int
	FechaInicio  *time.Time
	FechaEntrega *time.Time
}
