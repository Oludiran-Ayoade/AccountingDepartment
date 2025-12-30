package routes

import (
	"bowen-accounting-backend/controllers"
	"bowen-accounting-backend/middleware"

	"github.com/gin-gonic/gin"
)

func NoteRoutes(router *gin.RouterGroup) {
	notes := router.Group("/notes")
	{
		notes.GET("", controllers.GetNotes)
		notes.GET("/:id", controllers.GetNoteByID)
		
		// Protected routes
		notes.Use(middleware.AuthMiddleware())
		notes.POST("", middleware.AdminMiddleware(), controllers.CreateNote)
		notes.POST("/:id/download", controllers.DownloadNote)
		notes.DELETE("/:id", middleware.AdminMiddleware(), controllers.DeleteNote)
	}
}
