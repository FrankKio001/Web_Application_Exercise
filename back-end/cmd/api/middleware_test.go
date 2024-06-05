package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestSecurityHeadersMiddleware(t *testing.T) {
	//handler
	nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("test"))
	})

	//init middleware
	middleware := securityHeadersMiddleware(nextHandler)

	// http request
	req, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}

	//ResponseRecorder to get the respon
	rr := httptest.NewRecorder()

	middleware.ServeHTTP(rr, req)

	// security header check
	tests := []struct {
		header string
		value  string
	}{
		{"Content-Security-Policy", "default-src 'self'"},
		{"X-Frame-Options", "DENY"},
		{"X-Content-Type-Options", "nosniff"},
		{"Referrer-Policy", "no-referrer-when-downgrade"},
		{"Permissions-Policy", "geolocation=(self), microphone=()"},
	}

	for _, test := range tests {
		if val := rr.Header().Get(test.header); val != test.value {
			t.Errorf("Header %s got %s, want %s", test.header, val, test.value)
		}
	}
}

func TestRateLimiterMiddleware(t *testing.T) {
	// Create a simple handler that returns 200 OK
	nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	// Wrap the handler with the rateLimiterMiddleware
	testHandler := rateLimiterMiddleware(nextHandler)

	server := httptest.NewServer(testHandler)
	defer server.Close()

	client := server.Client()

	// Make rapid succession of requests
	for i := 0; i < 15; i++ {
		resp, err := client.Get(server.URL)
		if err != nil {
			t.Fatal(err)
		}

		// Expect the first 10 to succeed and then start failing
		if i < 10 {
			if resp.StatusCode != http.StatusOK {
				t.Errorf("Expected status code 200, got %d", resp.StatusCode)
			}
		} else {
			if resp.StatusCode != http.StatusTooManyRequests {
				t.Errorf("Expected status code 429, got %d", resp.StatusCode)
			}
		}

		resp.Body.Close()
	}
}

func TestCircuitBreakerMiddleware(t *testing.T) {

}
