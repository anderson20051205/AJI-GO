package handlers

import (
	"net/http"

	"github.com/ajigo/auth/internal/services"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	svc *services.AuthService
}

func NewAuthHandler(svc *services.AuthService) *AuthHandler {
	return &AuthHandler{svc: svc}
}

// ── DTOs ──────────────────────────────────────────────────────────────────────

type registerRequest struct {
	RolID         uint   `json:"rol_id"`
	NombreUsuario string `json:"nombre_usuario"`
	Email         string `json:"email"     binding:"required,email"`
	Contrasena    string `json:"contrasena" binding:"required,min=6"`
	Telefono      string `json:"telefono"`
}

type loginRequest struct {
	Email      string `json:"email"      binding:"required,email"`
	Contrasena string `json:"contrasena" binding:"required"`
}

// ── Endpoints ────────────────────────────────────────────────────────────────

// POST /register
func (h *AuthHandler) Register(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.RolID == 0 {
		req.RolID = 1 // default: Cliente
	}
	user, err := h.svc.Register(req.RolID, req.NombreUsuario, req.Email, req.Contrasena, req.Telefono)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"usuario": user})
}

// POST /login
func (h *AuthHandler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	token, err := h.svc.Login(req.Email, req.Contrasena)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"access_token": token, "token_type": "bearer"})
}

// GET /validate  (usado por otros microservicios internamente)
func (h *AuthHandler) Validate(c *gin.Context) {
	tokenStr := c.GetHeader("Authorization")
	if len(tokenStr) > 7 && tokenStr[:7] == "Bearer " {
		tokenStr = tokenStr[7:]
	}
	claims, err := h.svc.ValidateToken(tokenStr)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"usuario_id": claims.UsuarioID,
		"rol_id":     claims.RolID,
	})
}

// GET /health
func (h *AuthHandler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "auth"})
}

// ── Router ────────────────────────────────────────────────────────────────────

func (h *AuthHandler) RegisterRoutes(r *gin.Engine) {
	r.GET("/health", h.Health)
	r.POST("/register", h.Register)
	r.POST("/login", h.Login)
	r.GET("/validate", h.Validate)
}
