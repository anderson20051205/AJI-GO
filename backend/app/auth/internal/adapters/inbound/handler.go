package inbound

import (
	"net/http"

	"github.com/ajigo/auth/internal/application"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct{ Service *application.AuthService }

type loginRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Login godoc
// POST /api/auth/login
// Body: { "email": "...", "password": "..." }
func (h *AuthHandler) Login(c *gin.Context) {
	var req loginRequest
	// ✅ FIX: antes no se parseaba el body en absoluto
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Datos inválidos: " + err.Error(),
		})
		return
	}

	result, err := h.Service.Login(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token":   result.Token,
		"rol_id":  result.RolID,
		"user_id": result.UserID,
	})
}

type registerRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Nombre   string `json:"nombre"   binding:"required"`
	Telefono string `json:"telefono"`
	RolID    int    `json:"rol_id"`
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.RolID == 0 {
		req.RolID = 1 // rol cliente por defecto
	}
	if err := h.Service.Register(req.Email, req.Password, req.Nombre, req.Telefono, req.RolID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Usuario creado correctamente"})
}
