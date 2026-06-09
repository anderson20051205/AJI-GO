package outbound

import (
	"database/sql"
	"fmt"

	"github.com/ajigo/auth/internal/core/domain"
)

type SQLUserRepository struct{ DB *sql.DB }

// GetByEmail consulta la tabla USUARIOS por email.
// Devuelve domain.ErrNotFound si el usuario no existe o está inactivo.
func (r *SQLUserRepository) GetByEmail(email string) (*domain.User, error) {
	query := `
		SELECT UsuarioID, RolID, NombreUsuario, Email, Contrasena, Telefono, Activo, FechaRegistro
		FROM USUARIOS
		WHERE Email = @email
		  AND Activo = 1
	`

	row := r.DB.QueryRow(query, sql.Named("email", email))

	var u domain.User
	err := row.Scan(
		&u.UsuarioID,
		&u.RolID,
		&u.NombreUsuario,
		&u.Email,
		&u.Contrasena,
		&u.Telefono,
		&u.Activo,
		&u.FechaRegistro,
	)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("usuario no encontrado")
	}
	if err != nil {
		return nil, fmt.Errorf("error consultando usuario: %w", err)
	}

	return &u, nil
}

func (r *SQLUserRepository) CreateUser(email, hashedPassword, nombre, telefono string, rolID int) error {
	query := `
        INSERT INTO USUARIOS (RolID, NombreUsuario, Email, Contrasena, Telefono, Activo, FechaRegistro)
        VALUES (@rolID, @nombre, @email, @password, @telefono, 1, GETDATE())
    `
	_, err := r.DB.Exec(query,
		sql.Named("rolID", rolID),
		sql.Named("nombre", nombre),
		sql.Named("email", email),
		sql.Named("password", hashedPassword),
		sql.Named("telefono", telefono),
	)
	if err != nil {
		return fmt.Errorf("error creando usuario: %w", err)
	}
	return nil
}
