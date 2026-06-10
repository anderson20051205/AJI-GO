package database

import (
	"log"

	"github.com/ajigo/pedidos/internal/config"
	"github.com/ajigo/pedidos/internal/models"
	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
)

func Connect(cfg *config.Config) (*gorm.DB, error) {
	db, err := gorm.Open(sqlserver.Open(cfg.DSN()), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(
		&models.EstadoPedido{},
		&models.EstadoEnvio{},
		&models.Pedido{},
		&models.EntregaDetalle{},
		&models.DetallePedido{},
		&models.Envio{},
		&models.Pago{},
		&models.HistorialPedidoEstado{},
	)
	if err != nil {
		return nil, err
	}

	seedEstados(db)
	return db, nil
}

// seedEstados carga los estados de pedido y envío si la tabla está vacía
func seedEstados(db *gorm.DB) {
	var count int64
	db.Model(&models.EstadoPedido{}).Count(&count)
	if count > 0 {
		return
	}

	estados := []models.EstadoPedido{
		{EstadoPedidoID: 1, EstadoSTR: "Recibido"},
		{EstadoPedidoID: 2, EstadoSTR: "En Preparación"},
		{EstadoPedidoID: 3, EstadoSTR: "Listo / En Camino"},
		{EstadoPedidoID: 4, EstadoSTR: "Entregado"},
	}
	estadosEnvio := []models.EstadoEnvio{
		{EstadoID: 1, EstadoSTR: "Pendiente"},
		{EstadoID: 2, EstadoSTR: "En Camino"},
		{EstadoID: 3, EstadoSTR: "Entregado"},
	}

	db.Create(&estados)
	db.Create(&estadosEnvio)
	log.Println("✓ Estados de pedido y envío cargados")
}
