package controllers

import (
	"context"
	"fmt"
	"net/http"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"bowen-accounting-backend/config"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
)

func UploadFile(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// Get folder from query
	folder := c.DefaultQuery("folder", "general")

	// Open the file
	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer src.Close()

	// Get file extension
	ext := filepath.Ext(file.Filename)

	// Create clean filename without extension for public ID
	baseFilename := file.Filename[:len(file.Filename)-len(ext)]

	// Replace spaces with underscores
	baseFilename = strings.ReplaceAll(baseFilename, " ", "_")

	// Remove all characters except alphanumeric, underscores, and hyphens
	reg := regexp.MustCompile("[^a-zA-Z0-9_-]+")
	baseFilename = reg.ReplaceAllString(baseFilename, "")

	// Create public ID with timestamp
	publicID := fmt.Sprintf("%d_%s", time.Now().Unix(), baseFilename)

	// Upload to Cloudinary with longer timeout for large files
	ctx, cancel := context.WithTimeout(context.Background(), 120*time.Second)
	defer cancel()

	// Create bool pointers for Cloudinary params
	falsePtr := false
	truePtr := true

	uploadResult, err := config.CloudinaryInstance.Upload.Upload(
		ctx,
		src,
		uploader.UploadParams{
			Folder:         folder,
			PublicID:       publicID,
			UseFilename:    &falsePtr,
			UniqueFilename: &falsePtr,
			Overwrite:      &truePtr,
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to upload to Cloudinary: %v", err)})
		return
	}

	// Log for debugging
	fmt.Printf("Original filename: %s\n", file.Filename)
	fmt.Printf("Public ID: %s\n", uploadResult.PublicID)
	fmt.Printf("Cloudinary URL: %s\n", uploadResult.SecureURL)

	c.JSON(http.StatusOK, gin.H{
		"url":      uploadResult.SecureURL,
		"publicId": uploadResult.PublicID,
		"format":   uploadResult.Format,
		"size":     uploadResult.Bytes,
	})
}

func UploadProfilePicture(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// Validate file type
	ext := filepath.Ext(file.Filename)
	validExts := map[string]bool{".jpg": true, ".jpeg": true, ".png": true, ".gif": true, ".webp": true}
	if !validExts[ext] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type. Only images are allowed"})
		return
	}

	// Open the file
	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer src.Close()

	// Upload to Cloudinary with longer timeout
	ctx, cancel := context.WithTimeout(context.Background(), 120*time.Second)
	defer cancel()

	uploadResult, err := config.CloudinaryInstance.Upload.Upload(
		ctx,
		src,
		uploader.UploadParams{
			Folder:         "profile_pictures",
			ResourceType:   "image",
			Transformation: "c_fill,g_face,h_400,w_400",
			PublicID:       fmt.Sprintf("profile_%d", time.Now().Unix()),
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to upload to Cloudinary: %v", err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"url":      uploadResult.SecureURL,
		"publicId": uploadResult.PublicID,
	})
}
