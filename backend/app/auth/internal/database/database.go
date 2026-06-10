package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/microsoft/go-mssqldb" // Driver de SQL Server
)

// Connect realiza la conexión usando los datos del .env
func Connect(host, port, user, password, dbname string) (*sql.DB, error) {
	// String de conexión para SQL Server
	connString := fmt.Sprintf("server=%s;user id=%s;password=%s;port=%s;database=%s;encrypt=true;trustServerCertificate=true;",
		host, user, password, port, dbname)

	db, err := sql.Open("sqlserver", connString)
	if err != nil {
		return nil, err
	}

	// Verificar si la conexión es real
	err = db.Ping()
	if err != nil {
		return nil, err
	}

	log.Println("✓ Conexión a SQL Server exitosa")
	return db, nil
}
