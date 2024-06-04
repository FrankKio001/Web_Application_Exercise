package main

import (
	"net/http"
	"time"

	"github.com/sony/gobreaker/v2"
	"github.com/ulule/limiter/v3"
	"github.com/ulule/limiter/v3/drivers/middleware/stdlib"
	"github.com/ulule/limiter/v3/drivers/store/memory"
)

// 跨網站偽造請求攻擊（CSRF）
func (app *application) enableCORS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		allowedOrigins := []string{
			"http://www.mrkio.online",
			"http://3.27.186.104",
			"http://localhost",
			"http://localhost:3000",
		}
		for _, allowedOrigin := range allowedOrigins {
			if origin == allowedOrigin {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				break
			}
		}
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, X-CSRF-Token, Authorization")
			return
		} else {
			h.ServeHTTP(w, r)
		}
	})
}

func (app *application) authRequired(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _, err := app.auth.GetTokenFromHeaderAndVerify(w, r)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// Http Security Header
func securityHeadersMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//限制資源
		// w.Header().Set("Content-Security-Policy", "default-src 'self'")
		// //防止劫持(內容在別的網站中展示)
		// w.Header().Set("X-Frame-Options", "DENY")
		// w.Header().Set("X-Content-Type-Options", "nosniff")
		// //控制資訊傳送
		// w.Header().Set("Referrer-Policy", "no-referrer-when-downgrade")
		// //禁止使用Web功能
		// w.Header().Set("Permissions-Policy", "geolocation=(self), microphone=()")
		next.ServeHTTP(w, r)
	})
}

// 限流器
// github.com/ulule/limiter
func rateLimiterMiddleware(next http.Handler) http.Handler {
	// Define the rate limit: 10 requests per second
	rate := limiter.Rate{
		Period: 1 * time.Second,
		Limit:  10,
	}

	// Create a new in-memory store to hold the rate limiting counters
	store := memory.NewStore()
	// Initialize the rate limiter with the store and the predefined rate
	instance := limiter.New(store, rate)
	// Wrap the rate limiter with standard library compatible middleware
	middleware := stdlib.NewMiddleware(instance)

	return middleware.Handler(next)
}

// 熔斷器
// gobreaker：circuit breaker middleware for HTTP requests.
func circuitBreakerMiddleware(next http.Handler) http.Handler {
	// Define the settings
	cbSettings := gobreaker.Settings{
		Name:        "HTTP GET",
		MaxRequests: 6,
		Interval:    60 * time.Second, // Interval for the circuit breaker to reset counts
		Timeout:     30 * time.Second,
		ReadyToTrip: func(counts gobreaker.Counts) bool {
			return counts.ConsecutiveFailures > 3
		},
	}
	// Initialize
	circuitBreaker := gobreaker.NewCircuitBreaker[interface{}](cbSettings)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, err := circuitBreaker.Execute(func() (interface{}, error) {
			next.ServeHTTP(w, r)
			return nil, nil
		})

		if err != nil {
			http.Error(w, "Service unavailable", http.StatusServiceUnavailable)
			return
		}
	})
}
