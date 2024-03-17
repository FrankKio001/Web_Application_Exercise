package main

import (
	"backend/internal/graph"
	"backend/internal/models"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v4"
)

func (app *application) Home(w http.ResponseWriter, r *http.Request) {
	var payload = struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Version string `json:"version"`
	}{
		Status:  "active",
		Message: "Go Projects up and running",
		Version: "1.0.0",
	}

	_ = app.writeJSON(w, http.StatusOK, payload)
}

func (app *application) AllProjects(w http.ResponseWriter, r *http.Request) {
	projects, err := app.DB.AllProjects()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, projects)
}

func (app *application) authenticate(w http.ResponseWriter, r *http.Request) {
	// read json payload
	var requestPayload struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := app.readJSON(w, r, &requestPayload)
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	// validate user against database
	user, err := app.DB.GetUserByEmail(requestPayload.Email)
	if err != nil {
		app.errorJSON(w, errors.New("invalid credentials"), http.StatusBadRequest)
		return
	}

	// check password
	valid, err := user.PasswordMatches(requestPayload.Password)
	if err != nil || !valid {
		app.errorJSON(w, errors.New("invalid credentials"), http.StatusBadRequest)
		return
	}

	// create a jwt user
	u := jwtUser{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}

	// generate tokens
	tokens, err := app.auth.GenerateTokenPair(&u)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	refreshCookie := app.auth.GetRefreshCookie(tokens.RefreshToken)
	http.SetCookie(w, refreshCookie)

	app.writeJSON(w, http.StatusAccepted, tokens)
}

func (app *application) refreshToken(w http.ResponseWriter, r *http.Request) {
	for _, cookie := range r.Cookies() {
		if cookie.Name == app.auth.CookieName {
			claims := &Claims{}
			refreshToken := cookie.Value

			// parse the token to get the claims
			_, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
				return []byte(app.JWTSecret), nil
			})
			if err != nil {
				app.errorJSON(w, errors.New("unauthorized"), http.StatusUnauthorized)
				return
			}

			// get the user id from the token claims
			userID, err := strconv.Atoi(claims.Subject)
			if err != nil {
				app.errorJSON(w, errors.New("unknown user"), http.StatusUnauthorized)
				return
			}

			user, err := app.DB.GetUserByID(userID)
			if err != nil {
				app.errorJSON(w, errors.New("unknown user"), http.StatusUnauthorized)
				return
			}

			u := jwtUser{
				ID:        user.ID,
				FirstName: user.FirstName,
				LastName:  user.LastName,
			}

			tokenPairs, err := app.auth.GenerateTokenPair(&u)
			if err != nil {
				app.errorJSON(w, errors.New("error generating tokens"), http.StatusUnauthorized)
				return
			}

			http.SetCookie(w, app.auth.GetRefreshCookie(tokenPairs.RefreshToken))

			app.writeJSON(w, http.StatusOK, tokenPairs)

		}
	}
}

func (app *application) logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, app.auth.GetExpiredRefreshCookie())
	w.WriteHeader(http.StatusAccepted)
}

func (app *application) ProjectCatalog(w http.ResponseWriter, r *http.Request) {
	projects, err := app.DB.AllProjects()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, projects)
}

func (app *application) GetProject(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	projectID, err := strconv.Atoi(id)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	project, err := app.DB.OneProject(projectID)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, project)
}

func (app *application) ProjectForEdit(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	projectID, err := strconv.Atoi(id)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	project, skills, err := app.DB.OneProjectForEdit(projectID)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	var payload = struct {
		Project *models.Project `json:"project"`
		Skills  []*models.Skill `json:"skills"`
	}{
		project,
		skills,
	}

	_ = app.writeJSON(w, http.StatusOK, payload)
}

func (app *application) AllSkills(w http.ResponseWriter, r *http.Request) {
	skills, err := app.DB.AllSkills()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, skills)
}

func (app *application) InsertProject(w http.ResponseWriter, r *http.Request) {
	var project models.Project

	err := app.readJSON(w, r, &project)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	// try to get an image
	project.CreatedAt = time.Now()
	project.UpdatedAt = time.Now()

	newID, err := app.DB.InsertProject(project)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	// now handle skills\
	err = app.DB.UpdateProjectSkills(newID, project.SkillsArray)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	resp := JSONResponse{
		Error:   false,
		Message: "project updated",
	}

	app.writeJSON(w, http.StatusAccepted, resp)
}

// 新技能的函數
func (app *application) InsertSkill(w http.ResponseWriter, r *http.Request) {
	var skill models.Skill
	err := app.readJSON(w, r, &skill)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	id, err := app.DB.InsertSkill(skill)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	resp := JSONResponse{
		Error:   false,
		Message: "Skill added",
		Data:    id,
	}

	app.writeJSON(w, http.StatusCreated, resp)
}

func (app *application) UpdateProject(w http.ResponseWriter, r *http.Request) {
	var payload models.Project

	err := app.readJSON(w, r, &payload)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	project, err := app.DB.OneProject(payload.ID)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	project.Title = payload.Title
	project.Description = payload.Description
	project.TechnologyStack = payload.TechnologyStack
	project.Status = payload.Status
	project.Category = payload.Category
	project.Image = payload.Image
	project.UpdatedAt = time.Now()

	err = app.DB.UpdateProject(*project)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.DB.UpdateProjectSkills(project.ID, payload.SkillsArray)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	resp := JSONResponse{
		Error:   false,
		Message: "project updated",
	}

	app.writeJSON(w, http.StatusAccepted, resp)
}

func (app *application) DeleteProject(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.DB.DeleteProject(id)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	resp := JSONResponse{
		Error:   false,
		Message: "project deleted",
	}

	app.writeJSON(w, http.StatusAccepted, resp)
}

func (app *application) AllProjectsBySkill(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	projects, err := app.DB.AllProjects(id)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	app.writeJSON(w, http.StatusOK, projects)
}

func (app *application) projectsGraphQL(w http.ResponseWriter, r *http.Request) {
	// we need to populate our Graph type with the projects
	//projects, _ := app.DB.AllProjects()

	// get the query from the request
	q, _ := io.ReadAll(r.Body)
	query := string(q)

	// create a new variable of type *graph.Graph
	g := graph.New(app.DB)

	// set the query string on the variable
	g.QueryString = query

	// perform the query
	resp, err := g.Query()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	// send the response
	j, _ := json.MarshalIndent(resp, "", "\t")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(j)
}
