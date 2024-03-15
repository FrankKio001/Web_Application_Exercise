package graph

import (
	"backend/internal/models"
	"errors"
	"strings"

	"github.com/graphql-go/graphql"
)

// Graph is the type for our graphql operations
type Graph struct {
	Projects    []*models.Project
	QueryString string
	Config      graphql.SchemaConfig
	fields      graphql.Fields
	projectType *graphql.Object
}

// New is the factory method to create a new instance of the Graph type.
func New(projects []*models.Project) *Graph {

	// Define the object for our project. The fields match database field names.
	var projectType = graphql.NewObject(
		graphql.ObjectConfig{
			Name: "Project",
			Fields: graphql.Fields{
				"id": &graphql.Field{
					Type: graphql.Int,
				},
				"title": &graphql.Field{
					Type: graphql.String,
				},
				"description": &graphql.Field{
					Type: graphql.String,
				},
				"technology_stack": &graphql.Field{
					Type: graphql.String,
				},
				"status": &graphql.Field{
					Type: graphql.Int,
				},
				"category": &graphql.Field{
					Type: graphql.String,
				},
				"created_at": &graphql.Field{
					Type: graphql.DateTime,
				},
				"updated_at": &graphql.Field{
					Type: graphql.DateTime,
				},
				"image": &graphql.Field{
					Type: graphql.String,
				},
			},
		},
	)

	// define a fields variable, which lists available actions (list, search, get)
	var fields = graphql.Fields{

		"list": &graphql.Field{
			Type:        graphql.NewList(projectType),
			Description: "Get all projects",
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				return projects, nil
			},
		},

		"search": &graphql.Field{
			Type:        graphql.NewList(projectType),
			Description: "Search projects by skill",
			Args: graphql.FieldConfigArgument{
				"skillContains": &graphql.ArgumentConfig{
					Type: graphql.String,
				},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				var theList []*models.Project
				search, ok := params.Args["skillContains"].(string)
				if ok {
					// 遍歷所有項目
					for _, currentProject := range projects {
						for _, skill := range currentProject.Skills {
							// 搜索條件
							if strings.Contains(strings.ToLower(skill.Name), strings.ToLower(search)) {
								theList = append(theList, currentProject)
								break
							}
						}
					}
				}
				return theList, nil
			},
		},

		"get": &graphql.Field{
			Type:        projectType,
			Description: "Get project by skill",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.Int,
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				id, ok := p.Args["id"].(int)
				if ok {
					for _, project := range projects {
						if project.ID == id {
							return project, nil
						}
					}
				}
				return nil, nil
			},
		},
	}

	// return a pointer to the Graph type, populated with the correct information
	return &Graph{
		Projects:    projects,
		fields:      fields,
		projectType: projectType,
	}

}

func (g *Graph) Query() (*graphql.Result, error) {
	// 定義根查詢型態
	rootQuery := graphql.ObjectConfig{Name: "RootQuery", Fields: g.fields}
	// 創建 GraphQL schema 配置
	schemaConfig := graphql.SchemaConfig{Query: graphql.NewObject(rootQuery)}
	// 創建 schema
	schema, err := graphql.NewSchema(schemaConfig)
	if err != nil {
		return nil, err
	}

	params := graphql.Params{Schema: schema, RequestString: g.QueryString}
	resp := graphql.Do(params)
	if len(resp.Errors) > 0 {
		return nil, errors.New("error executing query")
	}

	return resp, nil
}
