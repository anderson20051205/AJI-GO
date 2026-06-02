package database

import (
	"github.com/ajigo/auth/internal/config"
	"github.com/ajigo/auth/internal/models"
	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
)

func Connect(cfg *config.Config) (*gorm.DB, error) {
	db, err := gorm.Open(sqlserver.Open(cfg.DSN()), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(
		&models.Role{},
		&models.Usuario{},
		&models.DireccionUsuario{},
	)
	return db, err
}
