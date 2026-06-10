package ports

import "github.com/ajigo/pedidos/internal/core/domain"

// PedidoRepository define el contrato que debe cumplir cualquier
// implementación de persistencia (SQL Server, mock, etc.)
type PedidoRepository interface {
	// Pedidos
	CrearPedido(pedido *domain.Pedido, detalles []domain.DetallePedido, entrega domain.EntregaDetalle, pago domain.Pago) (*domain.Pedido, error)
	GetPedidoPorID(id int) (*domain.Pedido, error)
	GetPedidoPorCodigo(codigo string) (*domain.Pedido, error)
	GetPedidosPorUsuario(usuarioID int) ([]domain.Pedido, error)
	GetPedidosPorSucursal(sucursalID int) ([]domain.Pedido, error)
	GetPedidosPendientes() ([]domain.Pedido, error)
	ActualizarEstado(pedidoID int, status int, estadoPedidoID int) error
	AsignarRepartidor(pedidoID int, nombre string, usuarioID int) error

	// Estados
	GetEstados() ([]domain.EstadoPedido, error)
	SeedEstados() error
}
