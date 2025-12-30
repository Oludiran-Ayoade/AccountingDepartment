package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PastQuestion struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string             `bson:"title" json:"title" binding:"required"`
	Description string             `bson:"description" json:"description"`
	Course      string             `bson:"course" json:"course" binding:"required"`
	CourseCode  string             `bson:"courseCode" json:"courseCode" binding:"required"`
	Level       int                `bson:"level" json:"level" binding:"required"` // 100, 200, 300, 400
	Semester    string             `bson:"semester" json:"semester" binding:"required"`
	Year        int                `bson:"year" json:"year" binding:"required"`
	FileURL     string             `bson:"fileUrl" json:"fileUrl" binding:"required"`
	FileName    string             `bson:"fileName" json:"fileName" binding:"required"`
	UploadedBy  primitive.ObjectID `bson:"uploadedBy" json:"uploadedBy"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
}

type CreatePastQuestionRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	Course      string `json:"course" binding:"required"`
	CourseCode  string `json:"courseCode" binding:"required"`
	Level       int    `json:"level" binding:"required,min=100,max=400"`
	Semester    string `json:"semester" binding:"required"`
	Year        int    `json:"year" binding:"required"`
	FileURL     string `json:"fileUrl" binding:"required"`
	FileName    string `json:"fileName" binding:"required"`
}
