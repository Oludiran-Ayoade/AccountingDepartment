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
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetNotes(c *gin.Context) {
	collection := config.GetCollection("notes")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Build filter
	filter := bson.M{}
	if course := c.Query("course"); course != "" {
		filter["course"] = course
	}
	if courseCode := c.Query("courseCode"); courseCode != "" {
		filter["courseCode"] = courseCode
	}
	if semester := c.Query("semester"); semester != "" {
		filter["semester"] = semester
	}
	if levelStr := c.Query("level"); levelStr != "" {
		// Convert level from string to int
		var level int
		if _, err := fmt.Sscanf(levelStr, "%d", &level); err == nil {
			filter["level"] = level
		}
	}
	if search := c.Query("search"); search != "" {
		filter["$or"] = []bson.M{
			{"title": bson.M{"$regex": search, "$options": "i"}},
			{"description": bson.M{"$regex": search, "$options": "i"}},
			{"course": bson.M{"$regex": search, "$options": "i"}},
		}
	}

	// Build sort
	sortBy := c.DefaultQuery("sortBy", "createdAt")
	sortOrder := -1 // descending
	if c.Query("sortOrder") == "asc" {
		sortOrder = 1
	}

	opts := options.Find().SetSort(bson.D{{Key: sortBy, Value: sortOrder}})

	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch notes"})
		return
	}
	defer cursor.Close(ctx)

	var notes []models.Note
	if err := cursor.All(ctx, &notes); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode notes"})
		return
	}

	c.JSON(http.StatusOK, notes)
}

func GetNoteByID(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid note ID"})
		return
	}

	collection := config.GetCollection("notes")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var note models.Note
	err = collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&note)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Note not found"})
		return
	}

	c.JSON(http.StatusOK, note)
}

func CreateNote(c *gin.Context) {
	var note models.Note
	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("userId")
	uploaderID, _ := primitive.ObjectIDFromHex(userID.(string))

	note.ID = primitive.NewObjectID()
	note.UploadedBy = uploaderID
	note.DownloadCount = 0
	note.CreatedAt = time.Now()
	note.UpdatedAt = time.Now()

	collection := config.GetCollection("notes")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, note)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create note"})
		return
	}

	c.JSON(http.StatusCreated, note)
}

func DownloadNote(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid note ID"})
		return
	}

	userID, _ := c.Get("userId")
	userObjectID, _ := primitive.ObjectIDFromHex(userID.(string))

	collection := config.GetCollection("notes")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Increment download count
	update := bson.M{"$inc": bson.M{"downloadCount": 1}}
	_, err = collection.UpdateOne(ctx, bson.M{"_id": objectID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update download count"})
		return
	}

	// Record download history
	downloadCollection := config.GetCollection("note_downloads")
	download := models.NoteDownload{
		ID:         primitive.NewObjectID(),
		NoteID:     objectID,
		UserID:     userObjectID,
		DownloadAt: time.Now(),
	}
	_, _ = downloadCollection.InsertOne(ctx, download)

	c.JSON(http.StatusOK, gin.H{"message": "Download recorded"})
}

func DeleteNote(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid note ID"})
		return
	}

	collection := config.GetCollection("notes")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.DeleteOne(ctx, bson.M{"_id": objectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete note"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Note not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Note deleted successfully"})
}
