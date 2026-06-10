package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/microsoft/go-mssqldb"
)

func Connect(host, port, user, password, dbname string) (*sql.DB, error) {
	connString := fmt.Sprintf(
		"server=%s;user id=%s;password=%s;port=%s;database=%s;encrypt=true;trustServerCertificate=true;",
		host, user, password, port, dbname,
	)

	db, err := sql.Open("sqlserver", connString)
	if err != nil {
		return nil, err
	}

	if err = db.Ping(); err != nil {
		return nil, err
	}

	log.Println("✓ Conexión a SQL Server exitosa")

	// Crear tablas si no existen
	if err = createTables(db); err != nil {
		return nil, fmt.Errorf("error creando tablas: %w", err)
	}

	return db, nil
}

func createTables(db *sql.DB) error {
	statements := []string{
		`IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='estado_pedido' AND xtype='U')
		 CREATE TABLE estado_pedido (
			estado_pedido_id INT PRIMARY KEY,
			estado_str       NVARCHAR(100) NOT NULL
		 )`,

		`IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='estado_envio' AND xtype='U')
		 CREATE TABLE estado_envio (
			estado_id  INT PRIMARY KEY,
			estado_str NVARCHAR(100) NOT NULL
		 )`,

		`IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='pedidos' AND xtype='U')
		 CREATE TABLE pedidos (
			pedido_id           INT IDENTITY(1,1) PRIMARY KEY,
			codigo_externo      NVARCHAR(20)  UNIQUE,
			usuario_id          INT NOT NULL,
			sucursal_id         INT NOT NULL,
			restaurant_nombre   NVARCHAR(100),
			status              INT NOT NULL DEFAULT 0,
			estado_pedido_id    INT NOT NULL DEFAULT 1,
			subtotal            FLOAT NOT NULL,
			costo_envio         FLOAT NOT NULL DEFAULT 0,
			descuento           FLOAT DEFAULT 0,
			impuesto            FLOAT DEFAULT 0,
			monto_total         FLOAT NOT NULL,
			cupon               NVARCHAR(50),
			repartidor_nombre   NVARCHAR(100),
			fecha_pedido        DATETIME DEFAULT GETDATE()
		 )`,

		`IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='entrega_detalles' AND xtype='U')
		 CREATE TABLE entrega_detalles (
			entrega_id INT IDENTITY(1,1) PRIMARY KEY,
			pedido_id  INT NOT NULL,
			method     NVARCHAR(20),
			faculty    NVARCHAR(150),
			floor      NVARCHAR(50),
			classroom  NVARCHAR(100),
			notes      NVARCHAR(500)
		 )`,

		`IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='detalle_pedido' AND xtype='U')
		 CREATE TABLE detalle_pedido (
			detalle_id      INT IDENTITY(1,1) PRIMARY KEY,
			pedido_id       INT NOT NULL,
			producto_id     INT,
			nombre_producto NVARCHAR(200),
			badge_text      NVARCHAR(10),
			cantidad        INT NOT NULL,
			precio_unitario FLOAT NOT NULL,
			precio_final    FLOAT NOT NULL,
			notas           NVARCHAR(500)
		 )`,

		`IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='pagos' AND xtype='U')
		 CREATE TABLE pagos (
			pago_id         INT IDENTITY(1,1) PRIMARY KEY,
			pedido_id       INT NOT NULL,
			metodo_pago_id  INT NOT NULL,
			monto           FLOAT NOT NULL,
			estado_pago     NVARCHAR(50) NOT NULL,
			comprobante_url NVARCHAR(500),
			fecha_pago      DATETIME
		 )`,

		`IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='envios' AND xtype='U')
		 CREATE TABLE envios (
			envio_id      INT IDENTITY(1,1) PRIMARY KEY,
			pedido_id     INT NOT NULL,
			usuario_id    INT,
			estado_id     INT NOT NULL DEFAULT 1,
			fecha_inicio  DATETIME,
			fecha_entrega DATETIME
		 )`,

		`IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='historial_pedido_estado' AND xtype='U')
		 CREATE TABLE historial_pedido_estado (
			historial_id    INT IDENTITY(1,1) PRIMARY KEY,
			pedido_id       INT NOT NULL,
			estado_pedido_id INT,
			status          INT,
			fecha_cambio    DATETIME DEFAULT GETDATE()
		 )`,
	}

	for _, stmt := range statements {
		if _, err := db.Exec(stmt); err != nil {
			return fmt.Errorf("error ejecutando: %s\n%w", stmt[:50], err)
		}
	}

	log.Println("✓ Tablas de pedidos verificadas/creadas")
	return nil
}
