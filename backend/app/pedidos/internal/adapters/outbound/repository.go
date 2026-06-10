package outbound

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/ajigo/pedidos/internal/core/domain"
)

type SQLPedidoRepository struct {
	DB *sql.DB
}

// ── Seed de estados ───────────────────────────────────────────────────────────

func (r *SQLPedidoRepository) SeedEstados() error {
	var count int
	err := r.DB.QueryRow("SELECT COUNT(*) FROM estado_pedido").Scan(&count)
	if err != nil || count > 0 {
		return err
	}

	estados := []struct {
		id  int
		str string
	}{
		{1, "Recibido"},
		{2, "En Preparación"},
		{3, "Listo / En Camino"},
		{4, "Entregado"},
	}
	for _, e := range estados {
		_, err := r.DB.Exec(
			"INSERT INTO estado_pedido (estado_pedido_id, estado_str) VALUES (@p1, @p2)",
			e.id, e.str,
		)
		if err != nil {
			return fmt.Errorf("error insertando estado %s: %w", e.str, err)
		}
	}

	estadosEnvio := []struct {
		id  int
		str string
	}{
		{1, "Pendiente"},
		{2, "En Camino"},
		{3, "Entregado"},
	}
	for _, e := range estadosEnvio {
		r.DB.Exec(
			"INSERT INTO estado_envio (estado_id, estado_str) VALUES (@p1, @p2)",
			e.id, e.str,
		)
	}

	log.Println("✓ Estados de pedido y envío cargados")
	return nil
}

// ── CrearPedido ───────────────────────────────────────────────────────────────

func (r *SQLPedidoRepository) CrearPedido(
	pedido *domain.Pedido,
	detalles []domain.DetallePedido,
	entrega domain.EntregaDetalle,
	pago domain.Pago,
) (*domain.Pedido, error) {

	tx, err := r.DB.Begin()
	if err != nil {
		return nil, fmt.Errorf("error iniciando transacción: %w", err)
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// 1. Insertar pedido
	var pedidoID int
	err = tx.QueryRow(`
		INSERT INTO pedidos
			(codigo_externo, usuario_id, sucursal_id, restaurant_nombre,
			 status, estado_pedido_id, subtotal, costo_envio,
			 descuento, impuesto, monto_total, cupon, fecha_pedido)
		OUTPUT INSERTED.pedido_id
		VALUES (@p1,@p2,@p3,@p4,@p5,@p6,@p7,@p8,@p9,@p10,@p11,@p12,GETDATE())`,
		pedido.CodigoExterno, pedido.UsuarioID, pedido.SucursalID,
		pedido.RestaurantNombre, pedido.Status, pedido.EstadoPedidoID,
		pedido.Subtotal, pedido.CostoEnvio, pedido.Descuento,
		pedido.Impuesto, pedido.MontoTotal, pedido.Cupon,
	).Scan(&pedidoID)
	if err != nil {
		return nil, fmt.Errorf("error insertando pedido: %w", err)
	}
	pedido.PedidoID = pedidoID

	// 2. Insertar detalle de entrega
	_, err = tx.Exec(`
		INSERT INTO entrega_detalles
			(pedido_id, method, faculty, floor, classroom, notes)
		VALUES (@p1,@p2,@p3,@p4,@p5,@p6)`,
		pedidoID, entrega.Method, entrega.Faculty,
		entrega.Floor, entrega.Classroom, entrega.Notes,
	)
	if err != nil {
		return nil, fmt.Errorf("error insertando entrega: %w", err)
	}

	// 3. Insertar detalles de items
	for _, d := range detalles {
		_, err = tx.Exec(`
			INSERT INTO detalle_pedido
				(pedido_id, producto_id, nombre_producto, badge_text,
				 cantidad, precio_unitario, precio_final, notas)
			VALUES (@p1,@p2,@p3,@p4,@p5,@p6,@p7,@p8)`,
			pedidoID, d.ProductoID, d.NombreProducto, d.BadgeText,
			d.Cantidad, d.PrecioUnitario, d.PrecioFinal, d.Notas,
		)
		if err != nil {
			return nil, fmt.Errorf("error insertando detalle: %w", err)
		}
	}

	// 4. Insertar pago
	_, err = tx.Exec(`
		INSERT INTO pagos
			(pedido_id, metodo_pago_id, monto, estado_pago)
		VALUES (@p1,@p2,@p3,@p4)`,
		pedidoID, pago.MetodoPagoID, pago.Monto, pago.EstadoPago,
	)
	if err != nil {
		return nil, fmt.Errorf("error insertando pago: %w", err)
	}

	// 5. Registrar en historial de estados
	_, err = tx.Exec(`
		INSERT INTO historial_pedido_estado
			(pedido_id, estado_pedido_id, status, fecha_cambio)
		VALUES (@p1,@p2,@p3,GETDATE())`,
		pedidoID, 1, 0,
	)
	if err != nil {
		return nil, fmt.Errorf("error insertando historial: %w", err)
	}

	if err = tx.Commit(); err != nil {
		return nil, fmt.Errorf("error en commit: %w", err)
	}

	pedido.Detalles = detalles
	return pedido, nil
}

// ── GetPedidoPorID ────────────────────────────────────────────────────────────

func (r *SQLPedidoRepository) GetPedidoPorID(id int) (*domain.Pedido, error) {
	return r.scanPedido("WHERE p.pedido_id = @p1", id)
}

func (r *SQLPedidoRepository) GetPedidoPorCodigo(codigo string) (*domain.Pedido, error) {
	return r.scanPedido("WHERE p.codigo_externo = @p1", codigo)
}

func (r *SQLPedidoRepository) scanPedido(where string, arg interface{}) (*domain.Pedido, error) {
	query := fmt.Sprintf(`
		SELECT p.pedido_id, p.codigo_externo, p.usuario_id, p.sucursal_id,
		       p.restaurant_nombre, p.status, p.estado_pedido_id,
		       p.subtotal, p.costo_envio, p.descuento, p.impuesto,
		       p.monto_total, p.cupon, p.repartidor_nombre, p.fecha_pedido
		FROM pedidos p
		%s`, where)

	row := r.DB.QueryRow(query, sql.Named("p1", arg))
	var p domain.Pedido
	err := row.Scan(
		&p.PedidoID, &p.CodigoExterno, &p.UsuarioID, &p.SucursalID,
		&p.RestaurantNombre, &p.Status, &p.EstadoPedidoID,
		&p.Subtotal, &p.CostoEnvio, &p.Descuento, &p.Impuesto,
		&p.MontoTotal, &p.Cupon, &p.RepartidorNombre, &p.FechaPedido,
	)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("pedido no encontrado")
	}
	if err != nil {
		return nil, fmt.Errorf("error consultando pedido: %w", err)
	}

	p.Detalles, _ = r.getDetalles(p.PedidoID)
	p.EntregaDetalle, _ = r.getEntrega(p.PedidoID)
	p.Pago, _ = r.getPago(p.PedidoID)
	return &p, nil
}

// ── GetPedidosPorUsuario ──────────────────────────────────────────────────────

func (r *SQLPedidoRepository) GetPedidosPorUsuario(usuarioID int) ([]domain.Pedido, error) {
	return r.listPedidos("WHERE usuario_id = @p1 ORDER BY fecha_pedido DESC", usuarioID)
}

func (r *SQLPedidoRepository) GetPedidosPorSucursal(sucursalID int) ([]domain.Pedido, error) {
	return r.listPedidos("WHERE sucursal_id = @p1 ORDER BY fecha_pedido DESC", sucursalID)
}

func (r *SQLPedidoRepository) GetPedidosPendientes() ([]domain.Pedido, error) {
	return r.listPedidos("WHERE status = 2 AND (repartidor_nombre IS NULL OR repartidor_nombre = '') ORDER BY fecha_pedido ASC", nil)
}

func (r *SQLPedidoRepository) listPedidos(where string, arg interface{}) ([]domain.Pedido, error) {
	query := fmt.Sprintf(`
		SELECT pedido_id, codigo_externo, usuario_id, sucursal_id,
		       restaurant_nombre, status, estado_pedido_id,
		       subtotal, costo_envio, descuento, impuesto,
		       monto_total, cupon, repartidor_nombre, fecha_pedido
		FROM pedidos %s`, where)

	var rows *sql.Rows
	var err error
	if arg != nil {
		rows, err = r.DB.Query(query, sql.Named("p1", arg))
	} else {
		rows, err = r.DB.Query(query)
	}
	if err != nil {
		return nil, fmt.Errorf("error listando pedidos: %w", err)
	}
	defer rows.Close()

	var pedidos []domain.Pedido
	for rows.Next() {
		var p domain.Pedido
		err := rows.Scan(
			&p.PedidoID, &p.CodigoExterno, &p.UsuarioID, &p.SucursalID,
			&p.RestaurantNombre, &p.Status, &p.EstadoPedidoID,
			&p.Subtotal, &p.CostoEnvio, &p.Descuento, &p.Impuesto,
			&p.MontoTotal, &p.Cupon, &p.RepartidorNombre, &p.FechaPedido,
		)
		if err != nil {
			continue
		}
		p.Detalles, _ = r.getDetalles(p.PedidoID)
		p.EntregaDetalle, _ = r.getEntrega(p.PedidoID)
		pedidos = append(pedidos, p)
	}
	return pedidos, nil
}

// ── ActualizarEstado ──────────────────────────────────────────────────────────

func (r *SQLPedidoRepository) ActualizarEstado(pedidoID int, status int, estadoPedidoID int) error {
	tx, err := r.DB.Begin()
	if err != nil {
		return err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	_, err = tx.Exec(`
		UPDATE pedidos SET status = @p1, estado_pedido_id = @p2
		WHERE pedido_id = @p3`,
		status, estadoPedidoID, pedidoID,
	)
	if err != nil {
		return fmt.Errorf("error actualizando estado: %w", err)
	}

	_, err = tx.Exec(`
		INSERT INTO historial_pedido_estado
			(pedido_id, estado_pedido_id, status, fecha_cambio)
		VALUES (@p1,@p2,@p3,GETDATE())`,
		pedidoID, estadoPedidoID, status,
	)
	if err != nil {
		return fmt.Errorf("error insertando historial: %w", err)
	}

	return tx.Commit()
}

// ── AsignarRepartidor ────────────────────────────────────────────────────────

func (r *SQLPedidoRepository) AsignarRepartidor(pedidoID int, nombre string, usuarioID int) error {
	tx, err := r.DB.Begin()
	if err != nil {
		return err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	_, err = tx.Exec(`
		UPDATE pedidos SET repartidor_nombre = @p1 WHERE pedido_id = @p2`,
		nombre, pedidoID,
	)
	if err != nil {
		return fmt.Errorf("error asignando repartidor: %w", err)
	}

	// Crear o actualizar envío
	var envioID int
	err = tx.QueryRow(
		"SELECT envio_id FROM envios WHERE pedido_id = @p1",
		pedidoID,
	).Scan(&envioID)

	if err == sql.ErrNoRows {
		now := time.Now()
		_, err = tx.Exec(`
			INSERT INTO envios (pedido_id, usuario_id, estado_id, fecha_inicio)
			VALUES (@p1,@p2,@p3,@p4)`,
			pedidoID, usuarioID, 2, now,
		)
	} else if err == nil {
		_, err = tx.Exec(`
			UPDATE envios SET usuario_id = @p1, estado_id = 2 WHERE pedido_id = @p2`,
			usuarioID, pedidoID,
		)
	}
	if err != nil {
		return fmt.Errorf("error en envio: %w", err)
	}

	return tx.Commit()
}

// ── GetEstados ────────────────────────────────────────────────────────────────

func (r *SQLPedidoRepository) GetEstados() ([]domain.EstadoPedido, error) {
	rows, err := r.DB.Query("SELECT estado_pedido_id, estado_str FROM estado_pedido")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var estados []domain.EstadoPedido
	for rows.Next() {
		var e domain.EstadoPedido
		rows.Scan(&e.EstadoPedidoID, &e.EstadoSTR)
		estados = append(estados, e)
	}
	return estados, nil
}

// ── Helpers internos ──────────────────────────────────────────────────────────

func (r *SQLPedidoRepository) getDetalles(pedidoID int) ([]domain.DetallePedido, error) {
	rows, err := r.DB.Query(`
		SELECT detalle_id, pedido_id, producto_id, nombre_producto,
		       badge_text, cantidad, precio_unitario, precio_final, notas
		FROM detalle_pedido WHERE pedido_id = @p1`, pedidoID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var detalles []domain.DetallePedido
	for rows.Next() {
		var d domain.DetallePedido
		rows.Scan(
			&d.DetalleID, &d.PedidoID, &d.ProductoID, &d.NombreProducto,
			&d.BadgeText, &d.Cantidad, &d.PrecioUnitario, &d.PrecioFinal, &d.Notas,
		)
		detalles = append(detalles, d)
	}
	return detalles, nil
}

func (r *SQLPedidoRepository) getEntrega(pedidoID int) (*domain.EntregaDetalle, error) {
	row := r.DB.QueryRow(`
		SELECT entrega_id, pedido_id, method, faculty, floor, classroom, notes
		FROM entrega_detalles WHERE pedido_id = @p1`, pedidoID)
	var e domain.EntregaDetalle
	err := row.Scan(&e.EntregaID, &e.PedidoID, &e.Method, &e.Faculty, &e.Floor, &e.Classroom, &e.Notes)
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *SQLPedidoRepository) getPago(pedidoID int) (*domain.Pago, error) {
	row := r.DB.QueryRow(`
		SELECT pago_id, pedido_id, metodo_pago_id, monto, estado_pago, comprobante_url, fecha_pago
		FROM pagos WHERE pedido_id = @p1`, pedidoID)
	var p domain.Pago
	err := row.Scan(&p.PagoID, &p.PedidoID, &p.MetodoPagoID, &p.Monto, &p.EstadoPago, &p.ComprobanteURL, &p.FechaPago)
	if err != nil {
		return nil, err
	}
	return &p, nil
}
