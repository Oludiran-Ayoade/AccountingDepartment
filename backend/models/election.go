package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Election struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title        string             `bson:"title" json:"title" binding:"required"`
	Description  string             `bson:"description" json:"description"`
	Status       string             `bson:"status" json:"status"` // "upcoming", "open", "closed"
	IsOpen       bool               `bson:"isOpen" json:"isOpen"` // Toggle to open/close election
	ElectionType string             `bson:"electionType" json:"electionType"` // "general" or "level-based"
	TargetLevel  int                `bson:"targetLevel" json:"targetLevel"` // 0 for general, specific level for level-based
	StartDate    time.Time          `bson:"startDate" json:"startDate"`
	EndDate      time.Time          `bson:"endDate" json:"endDate"`
	Positions    []Position         `bson:"positions" json:"positions"`
	CreatedAt    time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt    time.Time          `bson:"updatedAt" json:"updatedAt"`
}

type Position struct {
	ID          string      `bson:"id" json:"id"`
	Title       string      `bson:"title" json:"title"`
	Description string      `bson:"description" json:"description"`
	Level       int         `bson:"level" json:"level"` // 100, 200, 300, 400 - 0 means all levels
	Candidates  []Candidate `bson:"candidates" json:"candidates"`
}

type Candidate struct {
	ID           string             `bson:"id" json:"id"`
	UserID       primitive.ObjectID `bson:"userId" json:"userId"`
	Name         string             `bson:"name" json:"name"`
	Level        int                `bson:"level" json:"level"` // Student's level
	MatricNumber string             `bson:"matricNumber" json:"matricNumber"`
	Manifesto    string             `bson:"manifesto" json:"manifesto"`
	ImageURL     string             `bson:"imageUrl" json:"imageUrl"`
	IsWinner     bool               `bson:"isWinner" json:"isWinner"`
	VoteCount    int                `bson:"voteCount" json:"voteCount"`
}

type Vote struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ElectionID  primitive.ObjectID `bson:"electionId" json:"electionId"`
	PositionID  string             `bson:"positionId" json:"positionId"`
	CandidateID string             `bson:"candidateId" json:"candidateId"`
	UserID      primitive.ObjectID `bson:"userId" json:"userId"`
	VotedAt     time.Time          `bson:"votedAt" json:"votedAt"`
}

type VoteRequest struct {
	ElectionID  string `json:"electionId" binding:"required"`
	PositionID  string `json:"positionId" binding:"required"`
	CandidateID string `json:"candidateId" binding:"required"`
}
