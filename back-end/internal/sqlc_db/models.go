// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0

package sqlc_db

import (
	"database/sql"
	"time"
)

type User struct {
	ID        int32
	Email     string
	FirstName sql.NullString
	LastName  sql.NullString
	Password  string
	CreatedAt time.Time
	UpdatedAt time.Time
}
