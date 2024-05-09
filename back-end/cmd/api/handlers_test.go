package main

import (
	"backend/internal/models"
	"backend/internal/repository/mock"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
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
