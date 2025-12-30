package controllers

import (
	"context"
	"net/http"
	"time"

	"bowen-accounting-backend/config"
	"bowen-accounting-backend/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func CreatePastQuestion(c *gin.Context) {
	var req models.CreatePastQuestionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user ID from context (set by auth middleware)
	userID, _ := c.Get("userId")
	userIDStr := userID.(string)
	userObjID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	pastQuestion := models.PastQuestion{
		ID:          primitive.NewObjectID(),
		Title:       req.Title,
		Description: req.Description,
		Course:      req.Course,
		CourseCode:  req.CourseCode,
		Level:       req.Level,
		Semester:    req.Semester,
		Year:        req.Year,
		FileURL:     req.FileURL,
		FileName:    req.FileName,
		UploadedBy:  userObjID,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	collection := config.GetCollection("pastquestions")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = collection.InsertOne(ctx, pastQuestion)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create past question"})
		return
	}

	c.JSON(http.StatusCreated, pastQuestion)
}

func GetPastQuestions(c *gin.Context) {
	collection := config.GetCollection("pastquestions")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Optional filters
	filter := bson.M{}
	if level := c.Query("level"); level != "" {
		filter["level"] = level
	}
	if course := c.Query("course"); course != "" {
		filter["course"] = bson.M{"$regex": course, "$options": "i"}
	}

	// Sort by createdAt descending
	opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}})
	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch past questions"})
		return
	}
	defer cursor.Close(ctx)

	var pastQuestions []models.PastQuestion
	if err = cursor.All(ctx, &pastQuestions); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode past questions"})
		return
	}

	if pastQuestions == nil {
		pastQuestions = []models.PastQuestion{}
	}

	c.JSON(http.StatusOK, pastQuestions)
}

func GetPastQuestion(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid past question ID"})
		return
	}

	collection := config.GetCollection("pastquestions")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var pastQuestion models.PastQuestion
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&pastQuestion)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Past question not found"})
		return
	}

	c.JSON(http.StatusOK, pastQuestion)
}

func DeletePastQuestion(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid past question ID"})
		return
	}

	collection := config.GetCollection("pastquestions")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete past question"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Past question not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Past question deleted successfully"})
}
