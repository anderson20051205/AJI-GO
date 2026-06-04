package main

import (
	"log"

	"github.com/ajigo/auth/internal/config"
	"github.com/ajigo/auth/internal/database"
	"github.com/ajigo/auth/internal/handlers"
	"github.com/ajigo/auth/internal/services"
	"github.com/gin-contrib/cors" // <-- Nuevo import
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("Error conectando a la base de datos: %v", err)
	}
	log.Println("✓ Base de datos conectada")

	authSvc := services.NewAuthService(db, cfg.JWTSecret, cfg.JWTExpiryHours)
	authHandler := handlers.NewAuthHandler(authSvc)

	r := gin.Default()

	// <-- Configuración de CORS agregada -->
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true // Permite peticiones desde el frontend
	corsConfig.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(corsConfig))

	authHandler.RegisterRoutes(r)

	log.Println("✓ Auth service corriendo en :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Error iniciando servidor: %v", err)
	}
}
