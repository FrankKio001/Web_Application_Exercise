package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func (app *application) routes() http.Handler {
	// create a router mux
	mux := chi.NewRouter()

	mux.Use(middleware.Recoverer)
	mux.Use(app.enableCORS)

	// rate limiting and circuit breaker middleware
	mux.Use(rateLimiterMiddleware)
	mux.Use(circuitBreakerMiddleware)

	mux.Get("/", app.Home)

	mux.Post("/authenticate", app.authenticate)
	mux.Get("/refresh", app.refreshToken)
	mux.Get("/logout", app.logout)

	mux.Get("/projects", app.AllProjects)
	mux.Get("/projects/{id}", app.GetProject)

	mux.Get("/skills", app.AllSkills)
	mux.Get("/projects/skills/{id}", app.AllProjectsBySkill)

	mux.Post("/graph", app.projectsGraphQL)

	mux.Route("/admin", func(mux chi.Router) {
		mux.Use(app.authRequired)

		mux.Get("/projects", app.ProjectCatalog)
		mux.Get("/projects/{id}", app.ProjectForEdit)
		mux.Put("/projects/0", app.InsertProject)
		mux.Post("/skills", app.InsertSkill)
		mux.Patch("/projects/{id}", app.UpdateProject)
		mux.Delete("/projects/{id}", app.DeleteProject)
	})

	return mux
}
