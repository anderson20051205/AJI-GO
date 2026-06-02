package models

import "time"

type Role struct {
	RolID         uint      `gorm:"primaryKey"       json:"rol_id"`
	RolSTR        string    `gorm:"not null"         json:"rol_str"`
	FechaCreacion time.Time `gorm:"autoCreateTime"   json:"fecha_creacion"`
}

type Usuario struct {
	UsuarioID     uint      `gorm:"primaryKey"                        json:"usuario_id"`
	RolID         uint      `gorm:"not null"                          json:"rol_id"`
	NombreUsuario string    `                                         json:"nombre_usuario"`
	Email         string    `gorm:"uniqueIndex;not null;size:255"     json:"email"`
	Contrasena    string    `gorm:"not null"                          json:"-"`
	Telefono      string    `                                         json:"telefono"`
	Activo        bool      `gorm:"default:true"                      json:"activo"`
	FechaRegistro time.Time `gorm:"autoCreateTime"                    json:"fecha_registro"`
}

type DireccionUsuario struct {
	DireccionUsuarioID uint   `gorm:"primaryKey" json:"direccion_id"`
	UsuarioID          uint   `gorm:"not null"   json:"usuario_id"`
	SectorID           uint   `                  json:"sector_id"`
	Descripcion        string `                  json:"descripcion"`
	MapURL             string `                  json:"map_url"`
}
