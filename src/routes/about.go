package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func AboutRoutes(router *gin.Engine, title string) {
	router.GET("/about", func(c *gin.Context) {
		c.HTML(http.StatusOK, "src/templates/pages/about.gohtml", gin.H{
			"title":    title,
			"pageName": "about",
		})
	})
}
