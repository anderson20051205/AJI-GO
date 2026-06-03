package database

import (
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
		&models.DetallePedido{},
		&models.Envio{},
		&models.Pago{},
		&models.HistorialPedidoEstado{},
	)
	return db, err
}
