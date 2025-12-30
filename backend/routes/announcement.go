package routes

import (
	"bowen-accounting-backend/controllers"
	"bowen-accounting-backend/middleware"

	"github.com/gin-gonic/gin"
)

func AnnouncementRoutes(router *gin.RouterGroup) {
	announcements := router.Group("/announcements")
	{
		announcements.GET("", controllers.GetAnnouncements)
		announcements.GET("/:id", controllers.GetAnnouncement)
		
		// Admin only routes
		announcements.POST("", middleware.AuthMiddleware(), middleware.AdminMiddleware(), controllers.CreateAnnouncement)
		announcements.DELETE("/:id", middleware.AuthMiddleware(), middleware.AdminMiddleware(), controllers.DeleteAnnouncement)
	}
}
