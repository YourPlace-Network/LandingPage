package middleware

import (
	"github.com/gin-gonic/gin"
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
