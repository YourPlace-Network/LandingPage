package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func NotFoundRoutes(router *gin.Engine, title string) {
	router.NoRoute(func(c *gin.Context) {
		c.HTML(http.StatusNotFound, "src/templates/pages/notFound.gohtml", gin.H{
			"title":    title,
			"pageName": "notFound",
		})
	})
}
