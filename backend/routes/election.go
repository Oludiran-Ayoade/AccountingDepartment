package routes

import (
	"bowen-accounting-backend/controllers"
	"bowen-accounting-backend/middleware"

	"github.com/gin-gonic/gin"
)

func ElectionRoutes(router *gin.RouterGroup) {
	elections := router.Group("/elections")
	{
		elections.GET("", controllers.GetElections)
		elections.GET("/:id", controllers.GetElectionByID)
		elections.GET("/:id/results", controllers.GetElectionResults)
		
		// Protected routes
		elections.Use(middleware.AuthMiddleware())
		elections.POST("", middleware.AdminMiddleware(), controllers.CreateElection)
		elections.PUT("/:id", middleware.AdminMiddleware(), controllers.UpdateElection)
		elections.DELETE("/:id", middleware.AdminMiddleware(), controllers.DeleteElection)
		elections.PUT("/:id/toggle", middleware.AdminMiddleware(), controllers.ToggleElection)
		elections.PUT("/:id/declare-winner", middleware.AdminMiddleware(), controllers.DeclareWinner)
		elections.POST("/vote", controllers.CastVote)
		elections.GET("/my-votes", controllers.GetUserVotes)
	}
}
