package controllers

import (
	"net/http"
	"strconv"

	"bowen-accounting-backend/models"

	"github.com/gin-gonic/gin"
)

func GetAllCourses(c *gin.Context) {
	c.JSON(http.StatusOK, models.Courses)
}

func GetCoursesByLevel(c *gin.Context) {
	levelStr := c.Param("level")
	level, err := strconv.Atoi(levelStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid level"})
		return
	}

	courses := models.GetCoursesByLevel(level)
	c.JSON(http.StatusOK, courses)
}

func GetCoursesByLevelAndSemester(c *gin.Context) {
	levelStr := c.Param("level")
	semester := c.Param("semester")

	level, err := strconv.Atoi(levelStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid level"})
		return
	}

	courses := models.GetCoursesByLevelAndSemester(level, semester)
	c.JSON(http.StatusOK, courses)
}
