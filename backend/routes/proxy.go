package routes

import (
	"bowen-accounting-backend/controllers"

	"github.com/gin-gonic/gin"
)

func ProxyRoutes(router *gin.RouterGroup) {
	router.GET("/proxy/pdf", controllers.ProxyPDF)
}
