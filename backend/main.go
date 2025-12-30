package main

import (
	"context"
	"log"
	"os"
	"time"

	"bowen-accounting-backend/config"
	"bowen-accounting-backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize database
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := config.ConnectDB(ctx); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer func() {
		if err := config.DisconnectDB(context.Background()); err != nil {
			log.Fatal("Failed to disconnect from database:", err)
		}
	}()

	// Initialize Cloudinary
	if err := config.InitCloudinary(); err != nil {
		log.Fatal("Failed to initialize Cloudinary:", err)
	}

	// Initialize Gin router
	router := gin.Default()

	// CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("FRONTEND_URL")},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Bowen Accounting API is running",
		})
	})

	// API routes
	api := router.Group("/api")
	{
		routes.AuthRoutes(api)
		routes.NoteRoutes(api)
		routes.CourseRoutes(api)
		routes.ElectionRoutes(api)
		routes.UserRoutes(api)
		routes.AnnouncementRoutes(api)
		routes.PastQuestionRoutes(api)
		routes.UploadRoutes(api)
		routes.ProxyRoutes(api)
		routes.StatsRoutes(api)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
