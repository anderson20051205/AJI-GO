package domain

import "time"

type User struct {
	UsuarioID     int
	RolID         int
	NombreUsuario string
	Email         string
	Contrasena    string // <--- ¡Cuidado! Es "Contrasena", no "Password"
	Telefono      string
	Activo        bool
	FechaRegistro time.Time
}
