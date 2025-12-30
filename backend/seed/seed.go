package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"bowen-accounting-backend/config"
	"bowen-accounting-backend/models"
	"bowen-accounting-backend/utils"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(".env"); err != nil {
		log.Println("No .env file found, trying parent directory")
		if err := godotenv.Load("../.env"); err != nil {
			log.Println("No .env file found in parent directory either")
		}
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

	fmt.Println("Starting database seeding...")

	// Seed students for each level
	levels := []int{100, 200, 300, 400}
	collection := config.GetCollection("users")

	for _, level := range levels {
		fmt.Printf("Seeding %d Level students...\n", level)
		
		for i := 1; i <= 7; i++ {
			// Hash password
			hashedPassword, err := utils.HashPassword("password123")
			if err != nil {
				log.Printf("Failed to hash password for student %d: %v\n", i, err)
				continue
			}

			student := models.User{
				ID:           primitive.NewObjectID(),
				FirstName:    fmt.Sprintf("Student%d", i),
				LastName:     fmt.Sprintf("Level%d", level),
				Email:        fmt.Sprintf("student%d.level%d@bowen.edu.ng", i, level),
				MatricNumber: fmt.Sprintf("%d/%04d", level/100, 1000+i),
				Password:     hashedPassword,
				Role:         "student",
				Level:        level,
				ProfilePicture: "",
				CreatedAt:    time.Now(),
				UpdatedAt:    time.Now(),
			}

			_, err = collection.InsertOne(ctx, student)
			if err != nil {
				log.Printf("Failed to insert student %d for level %d: %v\n", i, level, err)
			} else {
				fmt.Printf("  ✓ Created: %s %s (%s)\n", student.FirstName, student.LastName, student.Email)
			}
		}
	}

	fmt.Println("\n✅ Database seeding completed!")
	fmt.Println("Total students created: 28 (7 per level)")
	fmt.Println("Default password for all students: password123")
}
