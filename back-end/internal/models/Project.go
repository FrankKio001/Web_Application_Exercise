package models

import (
	"time"
)

type Skill struct {
	ID      int    `json:"id"`
	Name    string `json:"skill_name"`
	Checked bool   `json:"checked"`
}

type Project struct {
	ID              int       `json:"id"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	TechnologyStack string    `json:"technology_stack"`
	Status          int       `json:"status"`
	Category        string    `json:"category"`
	Image           string    `json:"image"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
	Skills          []*Skill  `json:"skills,omitempty"`
	SkillsArray     []int     `json:"skills_array,omitempty"`
}
