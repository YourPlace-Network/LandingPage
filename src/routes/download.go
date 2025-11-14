package routes

import (
	"database/sql"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"html/template"
	"net/http"
	"net/url"
	"regexp"
)

func DownloadRoutes(router *gin.Engine, title string, db *sql.DB) {
	currentVersion := "0.1.0" // todo, don't hardcode this
	bucket := "https://yourplace-downloads.nyc3.digitaloceanspaces.com"
	downloads := map[string]string{
		"version": currentVersion,
		"windows": bucket + "/windows/YourPlace-" + currentVersion + ".exe",
		"osx":     bucket + "/osx/YourPlace-" + currentVersion + ".pkg",
		"linux":   bucket + "/linux/YourPlace-" + currentVersion,
	}
	downloadJson, _ := json.Marshal(downloads)

	router.GET("/download", func(c *gin.Context) {
		c.HTML(http.StatusOK, "src/templates/pages/download.gohtml", gin.H{
			"title":     title,
			"pageName":  "download",
			"downloads": template.JS(downloadJson), // use template.JS to safely inject JavaScript
		})
	})
	router.GET("/download/record", func(c *gin.Context) {
		allowedOS := []string{"windows", "osx", "linux"}
		os := c.Query("os")
		if !containsString(os, allowedOS) {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid os"})
			return
		}
		version, _ := url.QueryUnescape(c.Query("version"))
		if !isValidVersionFormat(version) {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid version"})
			return
		}
		_, _ = db.Exec("INSERT INTO downloads (address, version, os) VALUES (?, ?, ?)", c.ClientIP(), version, os)
		c.SecureJSON(http.StatusOK, gin.H{"status": "success"})
	})
	router.GET("/version", func(c *gin.Context) {
		c.SecureJSON(http.StatusOK, gin.H{"version": currentVersion})
	})
}
func containsString(s string, list []string) bool {
	for _, str := range list {
		if s == str {
			return true
		}
	}
	return false
}
func isValidVersionFormat(version string) bool {
	pattern := `^\d{1,3}\.\d{1,3}\.\d{1,4}$`
	matched, err := regexp.MatchString(pattern, version)
	if err != nil {
		return false
	}
	return matched
}
