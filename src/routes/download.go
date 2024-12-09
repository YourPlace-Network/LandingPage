package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/gorilla/csrf"
	"net/http"
)

func DownloadRoutes(router *gin.Engine, title string) {
	router.GET("/download", func(c *gin.Context) {
		token := csrf.Token(c.Request)
		c.HTML(http.StatusOK, "src/templates/pages/download.tmpl", gin.H{
			"title":     title,
			"pageName":  "download",
			"csrfToken": token,
		})
	})
}
