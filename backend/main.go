package main

import (
	"client-manager-api/database"
	"client-manager-api/handlers"
	"client-manager-api/repository"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	// Initialize database
	database.Init(".env")

	// Initialize repositories
	addressRepo := repository.NewPostgresAddressRepository(database.DB)
	userRepo := repository.NewPostgresUserRepository(database.DB, addressRepo)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	userHandler := handlers.NewUserHandler(userRepo)
	addressHandler := handlers.NewAddressHandler(addressRepo)

	r.GET("/users", userHandler.GetAll)
	r.GET("/users/:id", userHandler.GetByID)
	r.POST("/users", userHandler.Create)
	r.PATCH("/users/:id", userHandler.Update)
	r.DELETE("/users/:id", userHandler.Delete)

	r.GET("/addresses", addressHandler.GetAddresses)
	r.GET("/addresses/:id", addressHandler.GetByID)
	r.POST("/addresses", addressHandler.Create)
	r.PATCH("/addresses/:id", addressHandler.Update)
	r.DELETE("/addresses/:id", addressHandler.Delete)

	log.Println("Server starting on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
