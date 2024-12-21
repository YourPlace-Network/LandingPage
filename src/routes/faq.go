package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func FAQRoutes(router *gin.Engine, title string) {
	router.GET("/faq", func(c *gin.Context) {
		c.HTML(http.StatusOK, "src/templates/pages/faq.tmpl", gin.H{
			"title":    title,
			"pageName": "faq",
		})
	})
}
