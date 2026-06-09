package main

import (
	"log"
	"os"

	"github.com/ajigo/auth/internal/adapters/inbound"
	"github.com/ajigo/auth/internal/adapters/outbound"
	"github.com/ajigo/auth/internal/application"
	"github.com/ajigo/auth/internal/database"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// 1. Cargar variables de entorno desde la raíz del proyecto (backend/)
	// Usamos "../../.env" porque main.go está en backend/app/auth/cmd/
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Println("⚠️ No se encontró el archivo .env en la raíz, intentando usar variables del sistema...")
	} else {
		log.Println("✅ Archivo .env cargado correctamente")
	}

	// 2. Conectar a la base de datos usando variables de entorno
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	db, err := database.Connect(dbHost, dbPort, dbUser, dbPass, dbName)
	if err != nil {
		log.Fatalf("❌ Error fatal conectando a BD: %v", err)
	}
	defer db.Close()

	// 3. Inyección de dependencias (Arquitectura Hexagonal)
	repo := &outbound.SQLUserRepository{DB: db}
	service := &application.AuthService{Repo: repo}
	handler := &inbound.AuthHandler{Service: service}

	// 4. Configurar el servidor Gin
	r := gin.Default()

	// Rutas
	r.POST("/api/auth/login", handler.Login)
	r.POST("/api/auth/register", handler.Register)

	// 5. Iniciar servidor
	port := ":8080"
	log.Printf("🚀 Servicio Auth iniciado en puerto %s", port)
	r.Run(port)
}
