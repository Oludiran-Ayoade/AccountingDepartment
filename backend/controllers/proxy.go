package controllers

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ProxyPDF proxies PDF requests to hide Cloudinary URLs from users
func ProxyPDF(c *gin.Context) {
	// Get the Cloudinary URL from query parameter
	cloudinaryURL := c.Query("url")
	if cloudinaryURL == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "URL parameter is required"})
		return
	}

	// Log the request
	println("Proxying PDF from:", cloudinaryURL)

	// Fetch the PDF from Cloudinary
	resp, err := http.Get(cloudinaryURL)
	if err != nil {
		println("Error fetching PDF:", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch PDF"})
		return
	}
	defer resp.Body.Close()

	// Check if the request was successful
	if resp.StatusCode != http.StatusOK {
		println("Cloudinary returned status:", resp.StatusCode)
		c.JSON(resp.StatusCode, gin.H{"error": "Failed to fetch PDF from storage"})
		return
	}

	// Set CORS headers
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Methods", "GET, OPTIONS")
	c.Header("Access-Control-Allow-Headers", "Content-Type")

	// Set headers for PDF
	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Disposition", "inline")
	c.Header("Content-Length", resp.Header.Get("Content-Length"))

	// Copy the PDF data to response
	c.Status(http.StatusOK)
	_, err = io.Copy(c.Writer, resp.Body)
	if err != nil {
		println("Error streaming PDF:", err.Error())
		return
	}

	println("PDF proxied successfully")
}
