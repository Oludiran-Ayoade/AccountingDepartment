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

func GetElections(c *gin.Context) {
	collection := config.GetCollection("elections")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}})
	cursor, err := collection.Find(ctx, bson.M{}, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch elections"})
		return
	}
	defer cursor.Close(ctx)

	var elections []models.Election
	if err := cursor.All(ctx, &elections); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode elections"})
		return
	}

	c.JSON(http.StatusOK, elections)
}

func GetElectionByID(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid election ID"})
		return
	}

	collection := config.GetCollection("elections")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var election models.Election
	err = collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&election)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Election not found"})
		return
	}

	c.JSON(http.StatusOK, election)
}

func CreateElection(c *gin.Context) {
	var election models.Election
	if err := c.ShouldBindJSON(&election); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	election.ID = primitive.NewObjectID()
	election.CreatedAt = time.Now()
	election.UpdatedAt = time.Now()

	collection := config.GetCollection("elections")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, election)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create election"})
		return
	}

	c.JSON(http.StatusCreated, election)
}

func CastVote(c *gin.Context) {
	var req models.VoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("userId")
	userObjectID, _ := primitive.ObjectIDFromHex(userID.(string))
	electionObjectID, _ := primitive.ObjectIDFromHex(req.ElectionID)

	// Check if election is open
	electionCollection := config.GetCollection("elections")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var election models.Election
	err := electionCollection.FindOne(ctx, bson.M{"_id": electionObjectID}).Decode(&election)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Election not found"})
		return
	}

	if !election.IsOpen {
		c.JSON(http.StatusForbidden, gin.H{"error": "Election currently closed"})
		return
	}

	// Check if user already voted for this position
	voteCollection := config.GetCollection("votes")

	var existingVote models.Vote
	err = voteCollection.FindOne(ctx, bson.M{
		"electionId": electionObjectID,
		"positionId": req.PositionID,
		"userId":     userObjectID,
	}).Decode(&existingVote)

	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "You have already voted for this position"})
		return
	}

	// Record vote
	vote := models.Vote{
		ID:          primitive.NewObjectID(),
		ElectionID:  electionObjectID,
		PositionID:  req.PositionID,
		CandidateID: req.CandidateID,
		UserID:      userObjectID,
		VotedAt:     time.Now(),
	}

	_, err = voteCollection.InsertOne(ctx, vote)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record vote"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Vote recorded successfully"})
}

func GetUserVotes(c *gin.Context) {
	userID, _ := c.Get("userId")
	userObjectID, _ := primitive.ObjectIDFromHex(userID.(string))

	collection := config.GetCollection("votes")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"userId": userObjectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch votes"})
		return
	}
	defer cursor.Close(ctx)

	var votes []models.Vote
	if err := cursor.All(ctx, &votes); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode votes"})
		return
	}

	c.JSON(http.StatusOK, votes)
}

func GetElectionResults(c *gin.Context) {
	id := c.Param("id")
	electionObjectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid election ID"})
		return
	}

	collection := config.GetCollection("votes")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Aggregate votes by position and candidate
	pipeline := []bson.M{
		{"$match": bson.M{"electionId": electionObjectID}},
		{"$group": bson.M{
			"_id": bson.M{
				"positionId":  "$positionId",
				"candidateId": "$candidateId",
			},
			"count": bson.M{"$sum": 1},
		}},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch results"})
		return
	}
	defer cursor.Close(ctx)

	var results []bson.M
	if err := cursor.All(ctx, &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode results"})
		return
	}

	c.JSON(http.StatusOK, results)
}

func ToggleElection(c *gin.Context) {
	id := c.Param("id")
	electionObjectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid election ID"})
		return
	}

	var req struct {
		IsOpen bool `json:"isOpen"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := config.GetCollection("elections")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = collection.UpdateOne(
		ctx,
		bson.M{"_id": electionObjectID},
		bson.M{"$set": bson.M{
			"isOpen":    req.IsOpen,
			"updatedAt": time.Now(),
		}},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to toggle election"})
		return
	}

	status := "closed"
	if req.IsOpen {
		status = "opened"
	}

	c.JSON(http.StatusOK, gin.H{"message": "Election " + status + " successfully"})
}

func DeleteElection(c *gin.Context) {
	id := c.Param("id")
	electionObjectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid election ID"})
		return
	}

	collection := config.GetCollection("elections")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = collection.DeleteOne(ctx, bson.M{"_id": electionObjectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete election"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Election deleted successfully"})
}

func UpdateElection(c *gin.Context) {
	id := c.Param("id")
	electionObjectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid election ID"})
		return
	}

	var election models.Election
	if err := c.ShouldBindJSON(&election); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := config.GetCollection("elections")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	election.UpdatedAt = time.Now()
	_, err = collection.UpdateOne(
		ctx,
		bson.M{"_id": electionObjectID},
		bson.M{"$set": election},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update election"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Election updated successfully"})
}

func DeclareWinner(c *gin.Context) {
	id := c.Param("id")
	electionObjectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid election ID"})
		return
	}

	var req struct {
		PositionID  string `json:"positionId" binding:"required"`
		CandidateID string `json:"candidateId" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := config.GetCollection("elections")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Update the specific candidate's isWinner field
	_, err = collection.UpdateOne(
		ctx,
		bson.M{
			"_id":                  electionObjectID,
			"positions.id":         req.PositionID,
			"positions.candidates.id": req.CandidateID,
		},
		bson.M{"$set": bson.M{
			"positions.$[pos].candidates.$[cand].isWinner": true,
			"updatedAt": time.Now(),
		}},
		options.Update().SetArrayFilters(options.ArrayFilters{
			Filters: []interface{}{
				bson.M{"pos.id": req.PositionID},
				bson.M{"cand.id": req.CandidateID},
			},
		}),
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to declare winner"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Winner declared successfully"})
}
