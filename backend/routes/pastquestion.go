package routes

import (
	"bowen-accounting-backend/controllers"
	"bowen-accounting-backend/middleware"

	"github.com/gin-gonic/gin"
)

func PastQuestionRoutes(router *gin.RouterGroup) {
	pastQuestions := router.Group("/past-questions")
	{
		pastQuestions.GET("", controllers.GetPastQuestions)
		pastQuestions.GET("/:id", controllers.GetPastQuestion)
		
		// Admin only routes
		pastQuestions.POST("", middleware.AuthMiddleware(), middleware.AdminMiddleware(), controllers.CreatePastQuestion)
		pastQuestions.DELETE("/:id", middleware.AuthMiddleware(), middleware.AdminMiddleware(), controllers.DeletePastQuestion)
	}
}
