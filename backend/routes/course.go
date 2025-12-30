package routes

import (
	"bowen-accounting-backend/controllers"

	"github.com/gin-gonic/gin"
)

func CourseRoutes(router *gin.RouterGroup) {
	courses := router.Group("/courses")
	{
		courses.GET("", controllers.GetAllCourses)
		courses.GET("/level/:level", controllers.GetCoursesByLevel)
		courses.GET("/level/:level/semester/:semester", controllers.GetCoursesByLevelAndSemester)
	}
}
