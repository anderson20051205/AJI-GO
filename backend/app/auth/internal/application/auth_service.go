package application

import (
	"fmt"
	"os"
	"time"

	"github.com/ajigo/auth/internal/core/ports"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	Repo ports.UserRepository
}

type LoginResult struct {
	Token  string
	RolID  int
	UserID int
}

// Login valida credenciales y devuelve un JWT firmado.
func (s *AuthService) Login(email, password string) (*LoginResult, error) {
	user, err := s.Repo.GetByEmail(email)
	if err != nil {
		// No revelar si el usuario existe o no
		return nil, fmt.Errorf("credenciales inválidas")
	}

	// ✅ FIX: Comparación segura con bcrypt (antes era texto plano)
	if err := bcrypt.CompareHashAndPassword([]byte(user.Contrasena), []byte(password)); err != nil {
		return nil, fmt.Errorf("credenciales inválidas")
	}

	// Generar JWT
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "cambiar_en_produccion"
	}

	claims := jwt.MapClaims{
		"sub":   user.UsuarioID,
		"email": user.Email,
		"rol":   user.RolID,
		"exp":   time.Now().Add(24 * time.Hour).Unix(),
		"iat":   time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(secret))
	if err != nil {
		return nil, fmt.Errorf("error generando token: %w", err)
	}

	return &LoginResult{
		Token:  signed,
		RolID:  user.RolID,
		UserID: user.UsuarioID,
	}, nil
}

func (s *AuthService) Register(email, password, nombre, telefono string, rolID int) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("error hasheando contraseña: %w", err)
	}
	return s.Repo.CreateUser(email, string(hash), nombre, telefono, rolID)
}
