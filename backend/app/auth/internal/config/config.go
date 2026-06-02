package config

import (
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	DBHost         string
	DBPort         string
	DBUser         string
	DBPassword     string
	DBName         string
	JWTSecret      string
	JWTExpiryHours int
}

func Load() *Config {
	expiry, _ := strconv.Atoi(getEnv("JWT_EXPIRY_HOURS", "24"))
	return &Config{
		DBHost:         getEnv("DB_HOST", "db"),
		DBPort:         getEnv("DB_PORT", "1433"),
		DBUser:         getEnv("DB_USER", "sa"),
		DBPassword:     getEnv("DB_PASSWORD", ""),
		DBName:         getEnv("DB_NAME", "ajigo_db"),
		JWTSecret:      getEnv("JWT_SECRET", "change-me"),
		JWTExpiryHours: expiry,
	}
}

// DSN formato SQL Server
func (c *Config) DSN() string {
    return fmt.Sprintf(
        "sqlserver://%s:%s@%s?database=%s&port=%s&encrypt=disable",
        c.DBUser, c.DBPassword, c.DBHost, c.DBName, c.DBPort,
    )
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
