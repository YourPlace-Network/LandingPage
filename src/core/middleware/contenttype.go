package middleware

import (
	"github.com/gin-gonic/gin"
	"path/filepath"
	"strings"
)

func ContentTypeMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		path := c.Request.RequestURI
		if strings.HasPrefix(path, "/static/js/") && strings.HasSuffix(path, ".js") {
			c.Header("Content-Type", "application/javascript; charset=utf-8")
		}
	}
}

func CacheControlMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		path := c.Request.URL.Path
		extension := strings.ToLower(filepath.Ext(path))
		switch extension {
		case ".jpg", ".jpeg", ".png", ".gif", ".ico", ".svg", ".svg+xml", ".webp", ".woff", ".woff2":
			c.Header("Cache-Control", "public, max-age=604803") // Static assets with a longer cache time of 7 days
		case ".css", ".js":
			c.Header("Cache-Control", "public, max-age=86400") // CSS and JS files with a cache time of 24 hours
		case ".json":
			c.Header("Cache-Control", "private, max-age=60") // JSON/API responses with 1-minute cache
			//default:
			//	c.Header("Cache-Control", "no-cache, no-store") // Default to no cache
		}
		c.Next()
	}
}
