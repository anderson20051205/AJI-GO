package services

import (
	"errors"
	"time"

	"github.com/ajigo/auth/internal/models"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService struct {
	db         *gorm.DB
	jwtSecret  []byte
	expiryHours int
}

type Claims struct {
	UsuarioID uint `json:"usuario_id"`
	RolID     uint `json:"rol_id"`
	jwt.RegisteredClaims
}

func NewAuthService(db *gorm.DB, secret string, expiry int) *AuthService {
	return &AuthService{db: db, jwtSecret: []byte(secret), expiryHours: expiry}
}

// Register crea un nuevo usuario con la contraseña hasheada
func (s *AuthService) Register(rolID uint, nombre, email, password, telefono string) (*models.Usuario, error) {
	// Verificar email único
	var existing models.Usuario
	if err := s.db.Where("email = ?", email).First(&existing).Error; err == nil {
		return nil, errors.New("email ya registrado")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.Usuario{
		RolID:         rolID,
		NombreUsuario: nombre,
		Email:         email,
		Contrasena:    string(hash),
		Telefono:      telefono,
		Activo:        true,
	}
	if err := s.db.Create(user).Error; err != nil {
		return nil, err
	}
	return user, nil
}

// Login valida credenciales y devuelve un JWT
func (s *AuthService) Login(email, password string) (string, error) {
	var user models.Usuario
	if err := s.db.Where("email = ?", email).First(&user).Error; err != nil {
		return "", errors.New("credenciales incorrectas")
	}
	if !user.Activo {
		return "", errors.New("cuenta suspendida")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Contrasena), []byte(password)); err != nil {
		return "", errors.New("credenciales incorrectas")
	}

	claims := Claims{
		UsuarioID: user.UsuarioID,
		RolID:     user.RolID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(s.expiryHours) * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.jwtSecret)
}

// ValidateToken verifica un JWT y devuelve los claims
func (s *AuthService) ValidateToken(tokenStr string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (interface{}, error) {
		return s.jwtSecret, nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("token inválido")
	}
	return token.Claims.(*Claims), nil
}
