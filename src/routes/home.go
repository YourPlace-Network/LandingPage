package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/gorilla/csrf"
	"net/http"
)

func HomeRoutes(router *gin.Engine, title string) {
	router.GET("/", func(c *gin.Context) {
		token := csrf.Token(c.Request)
		c.HTML(http.StatusOK, "src/templates/pages/home.tmpl", gin.H{
			"title":     title,
			"pageName":  "home",
			"csrfToken": token,
		})
	})
}
