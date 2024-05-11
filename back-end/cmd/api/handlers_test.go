package main

import (
	"backend/internal/models"
	"backend/internal/repository/mock"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

func TestHomeHandler(t *testing.T) {
	app := &application{} // Initialize with mock dependencies as needed

	// Setup the HTTP request and recorder
	req, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr := httptest.NewRecorder()

	// Setup router with the route corresponding to the handler
	router := chi.NewRouter()
	router.Get("/", app.Home)

	// Serve the HTTP request
	router.ServeHTTP(rr, req)

	// Check the status code
	assert.Equal(t, http.StatusOK, rr.Code)

	// Check the response body
	var response map[string]string
	err = json.Unmarshal(rr.Body.Bytes(), &response)
	assert.Nil(t, err)
	assert.Equal(t, "active", response["status"])
	assert.Equal(t, "Go Projects up and running", response["message"])
	assert.Equal(t, "1.0.0", response["version"])
}

func TestAllProjectsHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	//建立mockDB
	mockDB := mock.NewMockDatabaseRepo(ctrl)
	app := &application{
		DB: mockDB,
	}

	// 呼叫
	mockDB.EXPECT().AllProjects().Return([]*models.Project{
		{
			ID:    1,
			Title: "Test Project 1",
		},
		{
			ID:    2,
			Title: "Test Project 2",
		},
	}, nil)

	req, err := http.NewRequest("GET", "/projects", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr := httptest.NewRecorder()

	router := chi.NewRouter()
	router.Get("/projects", app.AllProjects)
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
}

func TestAuthenticateHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockDB := mock.NewMockDatabaseRepo(ctrl)
	app := &application{DB: mockDB}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)
	mockUser := &models.User{
		ID:       1,
		Email:    "user@example.com",
		Password: string(hashedPassword),
	}

	// 確保只呼叫一次
	mockDB.EXPECT().GetUserByEmail("user@example.com").Return(mockUser, nil).AnyTimes()

	reqBody := strings.NewReader(`{"email":"user@example.com","password":"password"}`)
	req, err := http.NewRequest("POST", "/authenticate", reqBody)
	assert.NoError(t, err)
	rr := httptest.NewRecorder()

	router := chi.NewRouter()
	router.Post("/authenticate", app.authenticate)
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusAccepted, rr.Code)

	// 測試錯誤密碼情況
	reqBody = strings.NewReader(`{"email":"user@example.com","password":"wrongpassword"}`)
	req, err = http.NewRequest("POST", "/authenticate", reqBody)
	assert.NoError(t, err)
	rr = httptest.NewRecorder()

	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusBadRequest, rr.Code)
}

// 假設您的 DB 函數返回特定的 not found 錯誤
var ErrNotFound = errors.New("project not found")

func TestGetProjectHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockDB := mock.NewMockDatabaseRepo(ctrl)
	app := &application{DB: mockDB}

	projectID := 1
	mockDB.EXPECT().OneProject(projectID).Return(nil, sql.ErrNoRows) // 修改為返回 not found 錯誤

	req, err := http.NewRequest("GET", fmt.Sprintf("/project/%d", projectID), nil)
	assert.NoError(t, err)
	rr := httptest.NewRecorder()

	router := chi.NewRouter()
	router.Get("/project/{id}", app.GetProject)
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusNotFound, rr.Code)
}
