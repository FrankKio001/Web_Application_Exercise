package models

import (
	"time"
)

type Skill struct {
	ID        int       `json:"id"`
	Name      string    `json:"skill_name"`
	Checked   bool      `json:"checked"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}

type Project struct {
	ID              int       `json:"id"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	TechnologyStack string    `json:"technology_stack"`
	Status          string    `json:"status"`
	Category        string    `json:"category"`
	Image           string    `json:"image"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
	Skills          []*Skill  `json:"skills,omitempty"`
	SkillsArray     []int     `json:"skills_array,omitempty"`
}

//Category : college,personal,indie team
//status : ongoing...

//TechnologyStack : fullstuck,mobile apps,web app,web3...
//skill : programming language + technical structure + software
