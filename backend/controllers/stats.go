package controllers

import (
	"context"
	"net/http"
	"time"

	"bowen-accounting-backend/config"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func GetStats(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Count total notes
	notesCollection := config.GetCollection("notes")
	totalNotes, err := notesCollection.CountDocuments(ctx, bson.M{})
	if err != nil {
		totalNotes = 0
	}

	// Count total downloads
	downloadsCollection := config.GetCollection("note_downloads")
	totalDownloads, err := downloadsCollection.CountDocuments(ctx, bson.M{})
	if err != nil {
		totalDownloads = 0
	}

	// Count total users
	usersCollection := config.GetCollection("users")
	totalUsers, err := usersCollection.CountDocuments(ctx, bson.M{})
	if err != nil {
		totalUsers = 0
	}

	// Count active elections (status = "active")
	electionsCollection := config.GetCollection("elections")
	activeElections, err := electionsCollection.CountDocuments(ctx, bson.M{"status": "active"})
	if err != nil {
		activeElections = 0
	}

	// Get recent notes (top 3 by download count)
	pipeline := bson.A{
		bson.M{"$lookup": bson.M{
			"from":         "note_downloads",
			"localField":   "_id",
			"foreignField": "noteId",
			"as":           "downloads",
		}},
		bson.M{"$addFields": bson.M{"downloadCount": bson.M{"$size": "$downloads"}}},
		bson.M{"$sort": bson.M{"downloadCount": -1}},
		bson.M{"$limit": 3},
		bson.M{"$project": bson.M{
			"title":         1,
			"courseCode":    1,
			"downloadCount": 1,
		}},
	}

	cursor, err := notesCollection.Aggregate(ctx, pipeline)
	recentNotes := []bson.M{}
	if err == nil {
		cursor.All(ctx, &recentNotes)
	}

	// Get active elections with vote counts
	electionPipeline := bson.A{
		bson.M{"$match": bson.M{"status": "active"}},
		bson.M{"$lookup": bson.M{
			"from":         "votes",
			"localField":   "_id",
			"foreignField": "electionId",
			"as":           "votes",
		}},
		bson.M{"$addFields": bson.M{"voteCount": bson.M{"$size": "$votes"}}},
		bson.M{"$project": bson.M{
			"title":     1,
			"positions": 1,
			"voteCount": 1,
		}},
	}

	electionCursor, err := electionsCollection.Aggregate(ctx, electionPipeline)
	activeElectionsList := []bson.M{}
	if err == nil {
		electionCursor.All(ctx, &activeElectionsList)
	}

	c.JSON(http.StatusOK, gin.H{
		"totalNotes":          totalNotes,
		"totalDownloads":      totalDownloads,
		"totalUsers":          totalUsers,
		"activeElections":     activeElections,
		"recentNotes":         recentNotes,
		"activeElectionsList": activeElectionsList,
	})
}
