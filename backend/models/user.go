package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	FirstName      string             `bson:"firstName" json:"firstName" binding:"required"`
	LastName       string             `bson:"lastName" json:"lastName" binding:"required"`
	Email          string             `bson:"email" json:"email" binding:"required,email"`
	MatricNumber   string             `bson:"matricNumber" json:"matricNumber" binding:"required"`
	PhoneNumber    string             `bson:"phoneNumber" json:"phoneNumber"`
	Password       string             `bson:"password" json:"-"`
	Role           string             `bson:"role" json:"role"`   // "student" or "admin"
	Level          int                `bson:"level" json:"level"` // 100, 200, 300, 400
	ProfilePicture string             `bson:"profilePicture" json:"profilePicture"`
	CreatedAt      time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt      time.Time          `bson:"updatedAt" json:"updatedAt"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type RegisterRequest struct {
	FirstName    string `json:"firstName" binding:"required"`
	LastName     string `json:"lastName" binding:"required"`
	Email        string `json:"email" binding:"required,email"`
	MatricNumber string `json:"matricNumber" binding:"required"`
	PhoneNumber  string `json:"phoneNumber" binding:"required"`
	Password     string `json:"password" binding:"required,min=8"`
	Level        int    `json:"level" binding:"required,min=100,max=400"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type VerifyOTPRequest struct {
	Email string `json:"email" binding:"required,email"`
	OTP   string `json:"otp" binding:"required"`
}

type ResetPasswordRequest struct {
	Email           string `json:"email" binding:"required,email"`
	OTP             string `json:"otp" binding:"required"`
	NewPassword     string `json:"newPassword" binding:"required,min=8"`
	ConfirmPassword string `json:"confirmPassword" binding:"required,min=8"`
}

type OTP struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email     string             `bson:"email" json:"email"`
	OTP       string             `bson:"otp" json:"otp"`
	ExpiresAt time.Time          `bson:"expiresAt" json:"expiresAt"`
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt"`
}
