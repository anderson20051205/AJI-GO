package ports

import "github.com/ajigo/auth/internal/core/domain"

type UserRepository interface {
	GetByEmail(email string) (*domain.User, error)
	CreateUser(email, hashedPassword, nombre, telefono string, rolID int) error
}
