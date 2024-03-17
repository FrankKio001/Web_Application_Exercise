package repository

import (
	"backend/internal/models"
	"database/sql"
)

type DatabaseRepo interface {
	Connection() *sql.DB
	AllProjects(skill ...int) ([]*models.Project, error)
	GetUserByEmail(email string) (*models.User, error)
	GetUserByID(id int) (*models.User, error)

	LoadProjectsWithSkills() ([]*models.Project, error)
	OneProjectForEdit(id int) (*models.Project, []*models.Skill, error)
	OneProject(id int) (*models.Project, error)
	AllSkills() ([]*models.Skill, error)
	InsertProject(project models.Project) (int, error)
	InsertSkill(skill models.Skill) (int, error)
	UpdateProjectSkills(id int, skillIDs []int) error
	UpdateProject(project models.Project) error
	DeleteProject(id int) error
}
