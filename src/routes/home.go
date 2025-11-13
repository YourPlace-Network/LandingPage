package routes

import (
	"YourPlace/src/core/security"
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

func HomeRoutes(router *gin.Engine, title string, db *sql.DB, favicon []byte) {
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "src/templates/pages/home.gohtml", gin.H{
			"title":    title,
			"pageName": "home",
		})
	})
	router.GET("/favicon.ico", func(c *gin.Context) {
		c.Data(http.StatusOK, "image/x-icon", favicon)
	})
	router.GET("/unsubscribe", func(c *gin.Context) {
		c.HTML(http.StatusOK, "src/templates/pages/unsubscribe.gohtml", gin.H{
			"title":    title,
			"pageName": "unsubscribe",
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
		statement, err := db.Prepare("INSERT INTO subscribers (email, timestamp) VALUES (?, ?) ON CONFLICT (email) DO NOTHING")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"status": "Database error"})
			return
		}
		defer statement.Close()
		timestamp := time.Now().Unix()
		_, err = statement.Exec(payload.Email, timestamp)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": "Database error"})
			return
		}

		c.SecureJSON(http.StatusOK, gin.H{"status": "Subscribed"})
	})
	router.POST("/unsubscribe", func(c *gin.Context) {
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
		// Unsub email from database
		statement, err := db.Prepare("INSERT INTO unsubscribers (email, timestamp) VALUES (?, ?) ON CONFLICT (email) DO NOTHING")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"status": "Database error"})
			return
		}
		defer statement.Close()
		timestamp := time.Now().Unix()
		_, err = statement.Exec(payload.Email, timestamp)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": "Database error"})
			return
		}

		c.SecureJSON(http.StatusOK, gin.H{"status": "Unsubscribed"})
	})
}
