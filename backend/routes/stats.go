package routes

import (
	"bowen-accounting-backend/controllers"
	"bowen-accounting-backend/middleware"

	"github.com/gin-gonic/gin"
)

func StatsRoutes(router *gin.RouterGroup) {
	router.GET("/stats", middleware.AuthMiddleware(), middleware.AdminMiddleware(), controllers.GetStats)
}
