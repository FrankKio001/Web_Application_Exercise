package dbrepo

import (
	"backend/internal/models"
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"
)

type PostgresDBRepo struct {
	DB *sql.DB
}

const dbTimeout = time.Second * 3

func (m *PostgresDBRepo) Connection() *sql.DB {
	return m.DB
}

func (m *PostgresDBRepo) AllProjects(skill ...int) ([]*models.Project, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	where := ""
	if len(skill) > 0 {
		where = fmt.Sprintf("where id in (select project_id from projects_skills where skill_id = %d)", skill[0])
	}

	query := fmt.Sprintf(`
		select
			id, title, description, technology_stack,
			status, category, coalesce(image, ''),
			created_at, updated_at
		from
			projects %s
		order by
			title
	`, where)

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []*models.Project

	for rows.Next() {
		var project models.Project
		err := rows.Scan(
			&project.ID,
			&project.Title,
			&project.Description,
			&project.TechnologyStack,
			&project.Status,
			&project.Category,
			&project.Image,
			&project.CreatedAt,
			&project.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		projects = append(projects, &project)
	}

	return projects, nil
}

// LoadProjectsWithSkills fetches all projects along with their associated skills.
func (m *PostgresDBRepo) LoadProjectsWithSkills() ([]*models.Project, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
        SELECT p.id, p.title, p.description, p.technology_stack, p.status, p.category, p.image, p.created_at, p.updated_at,
               s.id AS skill_id, s.skill_name
        FROM projects p
        LEFT JOIN projects_skills ps ON p.id = ps.project_id
        LEFT JOIN skills s ON ps.skill_id = s.id
        ORDER BY p.id, s.id;
    `

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %w", err)
	}
	defer rows.Close()

	// A map to keep track of projects we've already seen
	projectMap := make(map[int]*models.Project)
	var projects []*models.Project

	for rows.Next() {
		var p models.Project
		var skillID sql.NullInt64
		var skillName sql.NullString

		// Scan the data into the Project struct and the skill variables
		err := rows.Scan(&p.ID, &p.Title, &p.Description, &p.TechnologyStack, &p.Status, &p.Category, &p.Image, &p.CreatedAt, &p.UpdatedAt,
			&skillID, &skillName)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}

		// If we haven't seen this project before, initialize its Skills slice and add it to the map
		if _, seen := projectMap[p.ID]; !seen {
			p.Skills = []*models.Skill{}
			projectMap[p.ID] = &p
			projects = append(projects, &p)
		}

		// If the skill is not null, add it to the project's Skills
		if skillID.Valid && skillName.Valid {
			projectMap[p.ID].Skills = append(projectMap[p.ID].Skills, &models.Skill{ID: int(skillID.Int64), Name: skillName.String})
		}
	}

	// Check for errors from iterating over rows
	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return projects, nil
}

func (m *PostgresDBRepo) OneProject(id int) (*models.Project, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id, title, description, technology_stack,
		status, category, coalesce(image, ''),created_at, updated_at
		from projects where id = $1`

	row := m.DB.QueryRowContext(ctx, query, id)

	var project models.Project

	err := row.Scan(
		&project.ID,
		&project.Title,
		&project.Description,
		&project.TechnologyStack,
		&project.Status,
		&project.Category,
		&project.Image,
		&project.CreatedAt,
		&project.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	// get skills, if any
	query = `select g.id, g.skill_name from projects_skills mg
		left join skills g on (mg.skill_id = g.id)
		where mg.project_id = $1
		order by g.skill_name`

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	defer rows.Close()

	var skills []*models.Skill
	for rows.Next() {
		var g models.Skill
		err := rows.Scan(
			&g.ID,
			&g.Name,
		)
		if err != nil {
			return nil, err
		}

		skills = append(skills, &g)
	}

	project.Skills = skills

	return &project, err
}

func (m *PostgresDBRepo) OneProjectForEdit(id int) (*models.Project, []*models.Skill, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `SELECT id, title, description, technology_stack,
		status, category, coalesce(image, ''),created_at, updated_at
		from projects where id = $1`

	row := m.DB.QueryRowContext(ctx, query, id)

	var project models.Project

	err := row.Scan(
		&project.ID,
		&project.Title,
		&project.Description,
		&project.TechnologyStack,
		&project.Status,
		&project.Category,
		&project.Image,
		&project.CreatedAt,
		&project.UpdatedAt,
	)

	if err != nil {
		return nil, nil, err
	}

	// get skills, if any
	query = `select g.id, g.skill_name from projects_skills mg
		left join skills g on (mg.skill_id = g.id)
		where mg.project_id = $1
		order by g.skill_name`

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil && err != sql.ErrNoRows {
		return nil, nil, err
	}
	defer rows.Close()

	var skills []*models.Skill
	var skillsArray []int

	for rows.Next() {
		var g models.Skill
		err := rows.Scan(
			&g.ID,
			&g.Name,
		)
		if err != nil {
			return nil, nil, err
		}

		skills = append(skills, &g)
		skillsArray = append(skillsArray, g.ID)
	}

	project.Skills = skills
	project.SkillsArray = skillsArray

	var allSkills []*models.Skill

	query = "select id, skill_name from skills order by skill_name"
	gRows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, nil, err
	}
	defer gRows.Close()

	for gRows.Next() {
		var g models.Skill
		err := gRows.Scan(
			&g.ID,
			&g.Name,
		)
		if err != nil {
			return nil, nil, err
		}

		allSkills = append(allSkills, &g)
	}

	return &project, allSkills, err
}

func (m *PostgresDBRepo) GetUserByEmail(email string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id, email, first_name, last_name, password,
			created_at, updated_at from users where email = $1`

	var user models.User
	row := m.DB.QueryRowContext(ctx, query, email)

	err := row.Scan(
		&user.ID,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (m *PostgresDBRepo) GetUserByID(id int) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id, email, first_name, last_name, password,
			created_at, updated_at from users where id = $1`

	var user models.User
	row := m.DB.QueryRowContext(ctx, query, id)

	err := row.Scan(
		&user.ID,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (m *PostgresDBRepo) AllSkills() ([]*models.Skill, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id, skill_name, created_at, updated_at from skills order by skill_name`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var skills []*models.Skill

	for rows.Next() {
		var g models.Skill
		err := rows.Scan(
			&g.ID,
			&g.Name,
			&g.CreatedAt,
			&g.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		skills = append(skills, &g)
	}

	return skills, nil
}

func (m *PostgresDBRepo) InsertProject(project models.Project) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	stmt := `insert into projects (title, description, technology_stack,
			status, category, image,created_at, updated_at)
			values ($1, $2, $3, $4, $5, $6, $7, $8) returning id`

	var newID int

	err := m.DB.QueryRowContext(ctx, stmt,
		&project.Title,
		&project.Description,
		&project.TechnologyStack,
		&project.Status,
		&project.Category,
		&project.Image,
		&project.CreatedAt,
		&project.UpdatedAt,
	).Scan(&newID)

	if err != nil {
		log.Printf("插入新項目時出錯: %v", err)
		return 0, err
	}

	if err != nil {
		return 0, err
	}

	return newID, nil
}

func (m *PostgresDBRepo) InsertSkill(skill models.Skill) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	stmt := `INSERT INTO skills (skill_name, created_at, updated_at) VALUES ($1, $2, $3) RETURNING id`

	var newID int
	err := m.DB.QueryRowContext(ctx, stmt, skill.Name, time.Now(), time.Now()).Scan(&newID)
	if err != nil {
		return 0, err
	}

	return newID, nil
}

func (m *PostgresDBRepo) UpdateProject(project models.Project) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	stmt := `update projects set title = $1, description = $2, technology_stack = $3,
				status = $4, category = $5,
				image = $6, updated_at = $7 where id = $8`

	_, err := m.DB.ExecContext(ctx, stmt,
		&project.Title,
		&project.Description,
		&project.TechnologyStack,
		&project.Status,
		&project.Category,
		&project.Image,
		&project.UpdatedAt,
		&project.ID,
	)

	if err != nil {
		return err
	}

	return nil
}

func (m *PostgresDBRepo) UpdateProjectSkills(id int, skillIDs []int) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	stmt := `delete from projects_skills where project_id = $1`

	_, err := m.DB.ExecContext(ctx, stmt, id)
	if err != nil {
		return err
	}

	for _, n := range skillIDs {
		stmt := `insert into projects_skills (project_id, skill_id) values ($1, $2)`
		_, err := m.DB.ExecContext(ctx, stmt, id, n)
		if err != nil {
			return err
		}
	}

	return nil
}

func (m *PostgresDBRepo) DeleteProject(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	stmt := `delete from projects where id = $1`

	_, err := m.DB.ExecContext(ctx, stmt, id)
	if err != nil {
		return err
	}

	return nil
}
