package main

import (
	"log"
	"os"

	"github.com/ajigo/pedidos/internal/adapters/inbound"
	"github.com/ajigo/pedidos/internal/adapters/outbound"
	"github.com/ajigo/pedidos/internal/application"
	"github.com/ajigo/pedidos/internal/database"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load("../../.env"); err != nil {
		log.Println("⚠️ No se encontró .env, usando variables del sistema...")
	}

	db, err := database.Connect(
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)
	if err != nil {
		log.Fatalf("❌ Error conectando a BD: %v", err)
	}
	defer db.Close()

	repo := &outbound.SQLPedidoRepository{DB: db}
	service := &application.PedidoService{Repo: repo}
	handler := &inbound.PedidoHandler{Service: service}

	r := gin.Default()
	handler.RegisterRoutes(r)

	log.Println("🚀 Pedidos service corriendo en :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Error iniciando servidor: %v", err)
	}
}
