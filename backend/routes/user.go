package routes

import (
	"bowen-accounting-backend/controllers"
	"bowen-accounting-backend/middleware"

	"github.com/gin-gonic/gin"
)

func UserRoutes(router *gin.RouterGroup) {
	users := router.Group("/users")
	users.Use(middleware.AuthMiddleware())
	{
		users.GET("/profile", controllers.GetProfile)
		users.GET("/downloads", controllers.GetDownloadHistory)
		users.GET("/students", middleware.AdminMiddleware(), controllers.GetStudentsByLevel)
		users.PUT("/profile-picture", controllers.UpdateProfilePicture)
	}
}
