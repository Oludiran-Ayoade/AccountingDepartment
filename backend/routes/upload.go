package routes

import (
	"bowen-accounting-backend/controllers"
	"bowen-accounting-backend/middleware"

	"github.com/gin-gonic/gin"
)

func UploadRoutes(router *gin.RouterGroup) {
	upload := router.Group("/upload")
	{
		upload.POST("/file", middleware.AuthMiddleware(), controllers.UploadFile)
		upload.POST("/profile-picture", middleware.AuthMiddleware(), controllers.UploadProfilePicture)
	}
}
