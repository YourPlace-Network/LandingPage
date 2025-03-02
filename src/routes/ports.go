package routes

import (
	"github.com/gin-gonic/gin"
	"net"
	"net/http"
	"sync"
	"time"
)

type rateLimiter struct {
	mu       sync.Mutex
	ips      map[string]time.Time
	limit    time.Duration
	maxSize  int
	stopChan chan struct{}
}

func PortRoutes(router *gin.Engine) {
	limiter := newRateLimiter(time.Second, 100000) // max 1 request per second per IP, with reasonable max size

	router.GET("/ports", func(c *gin.Context) {
		clientIP := c.ClientIP()

		if !limiter.allow(clientIP) {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "rate limit exceeded - max 1 per second per IP"})
			return
		}

		c.SecureJSON(http.StatusOK, gin.H{
			"4001":  isPortOpen(clientIP, 4001),
			"42424": isPortOpen(clientIP, 42424),
		})
	})
}

func newRateLimiter(limit time.Duration, maxSize int) *rateLimiter {
	rl := &rateLimiter{
		ips:      make(map[string]time.Time),
		limit:    limit,
		maxSize:  maxSize,
		stopChan: make(chan struct{}),
	}
	go rl.cleanupLoop()
	return rl
}
func (rl *rateLimiter) allow(ip string) bool {
	// allow checks if a request from the IP is allowed based on rate limits
	rl.mu.Lock()
	defer rl.mu.Unlock()
	now := time.Now()
	lastTime, exists := rl.ips[ip]
	// If IP exists and hasn't waited the requested time
	if exists && now.Sub(lastTime) < rl.limit {
		return false
	}
	// Update last request time
	rl.ips[ip] = now
	// If map exceeds size limit, force cleanup
	if len(rl.ips) > rl.maxSize {
		rl.cleanup()
	}
	return true
}
func (rl *rateLimiter) cleanup() {
	// cleanup removes old entries from the rate limiter map
	now := time.Now()
	expiredCutoff := now.Add(-rl.limit * 10) // Keep entries for 10x rate limit duration

	for ip, timestamp := range rl.ips {
		if timestamp.Before(expiredCutoff) {
			delete(rl.ips, ip)
		}
	}
}
func (rl *rateLimiter) cleanupLoop() {
	// cleanupLoop periodically cleans up the map
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()
	for {
		select {
		case <-ticker.C:
			rl.mu.Lock()
			rl.cleanup()
			rl.mu.Unlock()
		case <-rl.stopChan:
			return
		}
	}
}
func (rl *rateLimiter) stop() {
	// stops the cleanup loop
	close(rl.stopChan)
}
func isPortOpen(host string, port int) bool {
	address := net.JoinHostPort(host, string(port))
	conn, err := net.DialTimeout("tcp", address, 20*time.Second)
	if err != nil {
		return false
	}
	defer conn.Close()
	return true
}
