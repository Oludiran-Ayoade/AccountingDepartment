package controllers

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"bowen-accounting-backend/config"
	"bowen-accounting-backend/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetProfile(c *gin.Context) {
	userID, _ := c.Get("userId")
	objectID, _ := primitive.ObjectIDFromHex(userID.(string))

	collection := config.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	err := collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func GetDownloadHistory(c *gin.Context) {
	userID, _ := c.Get("userId")
	userObjectID, _ := primitive.ObjectIDFromHex(userID.(string))

	collection := config.GetCollection("note_downloads")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"userId": userObjectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch download history"})
		return
	}
	defer cursor.Close(ctx)

	var downloads []models.NoteDownload
	if err := cursor.All(ctx, &downloads); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode downloads"})
		return
	}

	c.JSON(http.StatusOK, downloads)
}

func GetStudentsByLevel(c *gin.Context) {
	levelStr := c.Query("level")
	
	collection := config.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"role": "student"}
	if levelStr != "" {
		// Convert string to int for database query
		var levelInt int
		if _, err := fmt.Sscanf(levelStr, "%d", &levelInt); err == nil {
			filter["level"] = levelInt
		}
	}

	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch students"})
		return
	}
	defer cursor.Close(ctx)

	var students []models.User
	if err := cursor.All(ctx, &students); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode students"})
		return
	}

	if students == nil {
		students = []models.User{}
	}

	c.JSON(http.StatusOK, students)
}

func UpdateProfilePicture(c *gin.Context) {
	userID, _ := c.Get("userId")
	userObjectID, _ := primitive.ObjectIDFromHex(userID.(string))

	var req struct {
		ProfilePicture string `json:"profilePicture"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := config.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.UpdateOne(
		ctx,
		bson.M{"_id": userObjectID},
		bson.M{"$set": bson.M{
			"profilePicture": req.ProfilePicture,
			"updatedAt":      time.Now(),
		}},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile picture"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile picture updated successfully"})
}
