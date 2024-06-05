package main

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

type LoginLimiter struct {
	client        *redis.Client
	maxAttempts   int
	blockDuration time.Duration
}

// NewLoginLimiter initializes and returns a new LoginLimiter.
func NewLoginLimiter(client *redis.Client, maxAttempts int, blockDuration time.Duration) *LoginLimiter {
	return &LoginLimiter{
		client:        client,
		maxAttempts:   maxAttempts,
		blockDuration: blockDuration,
	}
}

// IncrementAttempts increments the login attempts for the given IP address.
func (ll *LoginLimiter) IncrementAttempts(ip string) error {
	ctx := context.Background()
	_, err := ll.client.Incr(ctx, ip).Result()
	if err != nil {
		return err
	}
	_, err = ll.client.Expire(ctx, ip, ll.blockDuration).Result()
	return err
}

// ResetAttempts resets the login attempts for the given IP address.
func (ll *LoginLimiter) ResetAttempts(ip string) error {
	ctx := context.Background()
	_, err := ll.client.Del(ctx, ip).Result()
	return err
}

// IsBlocked checks if the given IP address is blocked based on the number of attempts.
func (ll *LoginLimiter) IsBlocked(ip string) (bool, error) {
	ctx := context.Background()
	attempts, err := ll.client.Get(ctx, ip).Int()
	if err == redis.Nil {
		return false, nil
	} else if err != nil {
		return false, err
	}
	return attempts >= ll.maxAttempts, nil
}
