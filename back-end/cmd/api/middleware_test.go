package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

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
