package application

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/ajigo/pedidos/internal/core/domain"
	"github.com/ajigo/pedidos/internal/core/ports"
)

type PedidoService struct {
	Repo ports.PedidoRepository
}

// ── DTOs de entrada ───────────────────────────────────────────────────────────

type ItemInput struct {
	ProductoID     int
	Name           string
	BadgeText      string
	Price          float64
	Quantity       int
	Notas          string
}

type EntregaInput struct {
	Method    string
	Faculty   string
	Floor     string
	Classroom string
	Notes     string
}

type CrearPedidoInput struct {
	UsuarioID      int
	SucursalID     int
	RestaurantName string
	MetodoPagoID   int
	Items          []ItemInput
	Subtotal       float64
	DeliveryFee    float64
	Discount       float64
	Tax            float64
	Total          float64
	Coupon         string
	Entrega        EntregaInput
}

type ActualizarEstadoInput struct {
	Status         int
	EstadoPedidoID int
}

type AsignarRepartidorInput struct {
	RepartidorNombre string
	UsuarioID        int
}

// ── Lógica de negocio ─────────────────────────────────────────────────────────

func (s *PedidoService) CrearPedido(input CrearPedidoInput) (*domain.Pedido, error) {
	if len(input.Items) == 0 {
		return nil, fmt.Errorf("el pedido debe tener al menos un item")
	}
	if input.Total <= 0 {
		return nil, fmt.Errorf("el total del pedido debe ser mayor a 0")
	}

	pedido := domain.Pedido{
		CodigoExterno:    generarCodigo(),
		UsuarioID:        input.UsuarioID,
		SucursalID:       input.SucursalID,
		RestaurantNombre: input.RestaurantName,
		Status:           0, // Recibido
		EstadoPedidoID:   1,
		Subtotal:         input.Subtotal,
		CostoEnvio:       input.DeliveryFee,
		Descuento:        input.Discount,
		Impuesto:         input.Tax,
		MontoTotal:       input.Total,
		Cupon:            input.Coupon,
	}

	var detalles []domain.DetallePedido
	for _, item := range input.Items {
		detalles = append(detalles, domain.DetallePedido{
			ProductoID:     item.ProductoID,
			NombreProducto: item.Name,
			BadgeText:      item.BadgeText,
			Cantidad:       item.Quantity,
			PrecioUnitario: item.Price,
			PrecioFinal:    item.Price * float64(item.Quantity),
			Notas:          item.Notas,
		})
	}

	entrega := domain.EntregaDetalle{
		Method:    input.Entrega.Method,
		Faculty:   input.Entrega.Faculty,
		Floor:     input.Entrega.Floor,
		Classroom: input.Entrega.Classroom,
		Notes:     input.Entrega.Notes,
	}

	pago := domain.Pago{
		MetodoPagoID: input.MetodoPagoID,
		Monto:        input.Total,
		EstadoPago:   "Pendiente",
	}

	return s.Repo.CrearPedido(&pedido, detalles, entrega, pago)
}

func (s *PedidoService) GetPedido(idStr string) (*domain.Pedido, error) {
	// Intenta por código "AG-XXXXXX" primero
	if len(idStr) > 3 && idStr[:3] == "AG-" {
		return s.Repo.GetPedidoPorCodigo(idStr)
	}
	// Si es numérico busca por ID
	var id int
	if _, err := fmt.Sscanf(idStr, "%d", &id); err != nil {
		return nil, fmt.Errorf("ID de pedido inválido")
	}
	return s.Repo.GetPedidoPorID(id)
}

func (s *PedidoService) GetPedidosPorUsuario(usuarioID int) ([]domain.Pedido, error) {
	return s.Repo.GetPedidosPorUsuario(usuarioID)
}

func (s *PedidoService) GetPedidosPorSucursal(sucursalID int) ([]domain.Pedido, error) {
	return s.Repo.GetPedidosPorSucursal(sucursalID)
}

func (s *PedidoService) GetPedidosPendientes() ([]domain.Pedido, error) {
	return s.Repo.GetPedidosPendientes()
}

func (s *PedidoService) ActualizarEstado(pedidoID int, input ActualizarEstadoInput) error {
	if input.Status < 0 || input.Status > 3 {
		return fmt.Errorf("status inválido: debe ser entre 0 y 3")
	}
	return s.Repo.ActualizarEstado(pedidoID, input.Status, input.EstadoPedidoID)
}

func (s *PedidoService) AsignarRepartidor(pedidoID int, input AsignarRepartidorInput) error {
	if input.RepartidorNombre == "" {
		return fmt.Errorf("el nombre del repartidor es obligatorio")
	}
	return s.Repo.AsignarRepartidor(pedidoID, input.RepartidorNombre, input.UsuarioID)
}

func (s *PedidoService) GetEstados() ([]domain.EstadoPedido, error) {
	return s.Repo.GetEstados()
}

// ── Helpers ───────────────────────────────────────────────────────────────────

func generarCodigo() string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprintf("AG-%06d", rand.Intn(900000)+100000)
}
