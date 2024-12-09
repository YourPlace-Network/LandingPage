package routes

import (
	"YourPlace/src/core/security"
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

	router.POST("/subscribe", func(c *gin.Context) {
		type Payload struct {
			Email string `json:"email" required:"true"`
		}
		var payload Payload
		err := c.BindJSON(&payload)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"status": "Invalid email json"})
			return
		}
		if !security.IsEmailValid(payload.Email) {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"status": "Invalid email address"})
			return
		}

		// Save email to database

		c.SecureJSON(http.StatusOK, gin.H{"status": "Subscribed"})
	})
}
