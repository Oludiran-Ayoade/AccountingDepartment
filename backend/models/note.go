package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Note struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title         string             `bson:"title" json:"title" binding:"required"`
	Description   string             `bson:"description" json:"description"`
	Course        string             `bson:"course" json:"course" binding:"required"`
	CourseCode    string             `bson:"courseCode" json:"courseCode" binding:"required"`
	Level         int                `bson:"level" json:"level" binding:"required"`
	Semester      string             `bson:"semester" json:"semester" binding:"required"`
	Lecturer      string             `bson:"lecturer" json:"lecturer"`
	FileType      string             `bson:"fileType" json:"fileType"`
	FileURL       string             `bson:"fileUrl" json:"fileUrl"`
	ThumbnailURL  string             `bson:"thumbnailUrl" json:"thumbnailUrl"`
	UploadedBy    primitive.ObjectID `bson:"uploadedBy" json:"uploadedBy"`
	UploaderName  string             `bson:"uploaderName" json:"uploaderName"`
	DownloadCount int                `bson:"downloadCount" json:"downloadCount"`
	CreatedAt     time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt     time.Time          `bson:"updatedAt" json:"updatedAt"`
}

type NoteDownload struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	NoteID     primitive.ObjectID `bson:"noteId" json:"noteId"`
	UserID     primitive.ObjectID `bson:"userId" json:"userId"`
	DownloadAt time.Time          `bson:"downloadAt" json:"downloadAt"`
}
