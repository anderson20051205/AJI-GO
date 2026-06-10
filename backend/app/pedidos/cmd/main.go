package main

import (
	"log"

	"github.com/ajigo/pedidos/internal/config"
	"github.com/ajigo/pedidos/internal/database"
	"github.com/ajigo/pedidos/internal/handlers"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("Error conectando a la base de datos: %v", err)
	}
	log.Println("✓ Base de datos conectada")

	pedidoHandler := handlers.NewPedidoHandler(db)

	r := gin.Default()
	pedidoHandler.RegisterRoutes(r)

	log.Println("✓ Pedidos service corriendo en :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Error iniciando servidor: %v", err)
	}
}
