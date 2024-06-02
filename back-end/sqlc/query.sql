-- name: GetUserByEmail :one
SELECT id, email, first_name, last_name, password, created_at, updated_at
FROM users
WHERE email = $1;

-- name: GetUserByID :one
SELECT id, email, first_name, last_name, password, created_at, updated_at
FROM users
WHERE id = $1;