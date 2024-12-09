package routes

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/csrf"
	"html/template"
	"net/http"
)

func DownloadRoutes(router *gin.Engine, title string) {
	currentVersion := "0.1.0"
	bucket := "https://yourplace-downloads.nyc3.digitaloceanspaces.com"
	downloads := map[string]map[string]string{
		"version": {
			"latest": currentVersion,
		},
		"windows": {
			"amd64": bucket + "/win-amd64/" + currentVersion + "/YourPlace.exe",
		},
		"osx": {
			"amd64": bucket + "/osx-amd64/" + currentVersion + "/YourPlace",
			"arm64": bucket + "/osx-arm64/" + currentVersion + "/YourPlace",
		},
	}
	downloadJson, _ := json.Marshal(downloads)

	router.GET("/download", func(c *gin.Context) {
		token := csrf.Token(c.Request)
		c.HTML(http.StatusOK, "src/templates/pages/download.tmpl", gin.H{
			"title":     title,
			"pageName":  "download",
			"csrfToken": token,
			"downloads": template.JS(downloadJson), // use template.JS to safely inject JavaScript
		})
	})

	router.GET("/version", func(c *gin.Context) {
		c.SecureJSON(http.StatusOK, gin.H{"version": currentVersion})
	})
}
