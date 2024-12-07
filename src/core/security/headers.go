package security

import (
	"github.com/gin-gonic/gin"
)

func Headers() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Content-Security-Policy",
			"default-src 'none'; "+
				"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.bridge.walletconnect.org; "+ // unsafe-inline and unsafe-eval are due to bootstrap
				"img-src 'self' https://* data: blob:; "+ // wildcard all HTTPS connections to allow for 3rd party image embeds
				"style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; "+
				"media-src 'self' data:; "+
				"font-src 'self' https://fonts.gstatic.com; "+
				"connect-src 'self' data: https://* wss://*:*; "+ // this must wildcard all TLS connections to allow for P2P traffic
				"frame-src 'self'; ")
		c.Header("X-Content-Options", "nosniff")
		c.Header("Cache-Control", "max-age=604800")
		//c.Header("X-Frame-Options", fmt.Sprintf("sameorigin"))
	}
}
