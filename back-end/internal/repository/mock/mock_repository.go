// Code generated by MockGen. DO NOT EDIT.
// Source: C:/Users/Hohokio/Desktop/mrkio/back-end/internal/repository/repository.go

// Package mock is a generated GoMock package.
package mock

import (
	models "backend/internal/models"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
	pgxpool "github.com/jackc/pgx/v4/pgxpool"
)

// MockDatabaseRepo is a mock of DatabaseRepo interface.
type MockDatabaseRepo struct {
	ctrl     *gomock.Controller
	recorder *MockDatabaseRepoMockRecorder
}

// MockDatabaseRepoMockRecorder is the mock recorder for MockDatabaseRepo.
type MockDatabaseRepoMockRecorder struct {
	mock *MockDatabaseRepo
}

// NewMockDatabaseRepo creates a new mock instance.
func NewMockDatabaseRepo(ctrl *gomock.Controller) *MockDatabaseRepo {
	mock := &MockDatabaseRepo{ctrl: ctrl}
	mock.recorder = &MockDatabaseRepoMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockDatabaseRepo) EXPECT() *MockDatabaseRepoMockRecorder {
	return m.recorder
}

// AllProjects mocks base method.
func (m *MockDatabaseRepo) AllProjects(skill ...int) ([]*models.Project, error) {
	m.ctrl.T.Helper()
	varargs := []interface{}{}
	for _, a := range skill {
		varargs = append(varargs, a)
	}
	ret := m.ctrl.Call(m, "AllProjects", varargs...)
	ret0, _ := ret[0].([]*models.Project)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// AllProjects indicates an expected call of AllProjects.
func (mr *MockDatabaseRepoMockRecorder) AllProjects(skill ...interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "AllProjects", reflect.TypeOf((*MockDatabaseRepo)(nil).AllProjects), skill...)
}

// AllSkills mocks base method.
func (m *MockDatabaseRepo) AllSkills() ([]*models.Skill, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "AllSkills")
	ret0, _ := ret[0].([]*models.Skill)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// AllSkills indicates an expected call of AllSkills.
func (mr *MockDatabaseRepoMockRecorder) AllSkills() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "AllSkills", reflect.TypeOf((*MockDatabaseRepo)(nil).AllSkills))
}

// Connection mocks base method.
func (m *MockDatabaseRepo) Connection() *pgxpool.Pool {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Connection")
	ret0, _ := ret[0].(*pgxpool.Pool)
	return ret0
}

// Connection indicates an expected call of Connection.
func (mr *MockDatabaseRepoMockRecorder) Connection() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Connection", reflect.TypeOf((*MockDatabaseRepo)(nil).Connection))
}

// DeleteProject mocks base method.
func (m *MockDatabaseRepo) DeleteProject(id int) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteProject", id)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteProject indicates an expected call of DeleteProject.
func (mr *MockDatabaseRepoMockRecorder) DeleteProject(id interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteProject", reflect.TypeOf((*MockDatabaseRepo)(nil).DeleteProject), id)
}

// GetUserByEmail mocks base method.
func (m *MockDatabaseRepo) GetUserByEmail(email string) (*models.User, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetUserByEmail", email)
	ret0, _ := ret[0].(*models.User)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetUserByEmail indicates an expected call of GetUserByEmail.
func (mr *MockDatabaseRepoMockRecorder) GetUserByEmail(email interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetUserByEmail", reflect.TypeOf((*MockDatabaseRepo)(nil).GetUserByEmail), email)
}

// GetUserByID mocks base method.
func (m *MockDatabaseRepo) GetUserByID(id int) (*models.User, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetUserByID", id)
	ret0, _ := ret[0].(*models.User)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetUserByID indicates an expected call of GetUserByID.
func (mr *MockDatabaseRepoMockRecorder) GetUserByID(id interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetUserByID", reflect.TypeOf((*MockDatabaseRepo)(nil).GetUserByID), id)
}

// InsertProject mocks base method.
func (m *MockDatabaseRepo) InsertProject(project models.Project) (int, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "InsertProject", project)
	ret0, _ := ret[0].(int)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// InsertProject indicates an expected call of InsertProject.
func (mr *MockDatabaseRepoMockRecorder) InsertProject(project interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "InsertProject", reflect.TypeOf((*MockDatabaseRepo)(nil).InsertProject), project)
}

// InsertSkill mocks base method.
func (m *MockDatabaseRepo) InsertSkill(skill models.Skill) (int, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "InsertSkill", skill)
	ret0, _ := ret[0].(int)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// InsertSkill indicates an expected call of InsertSkill.
func (mr *MockDatabaseRepoMockRecorder) InsertSkill(skill interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "InsertSkill", reflect.TypeOf((*MockDatabaseRepo)(nil).InsertSkill), skill)
}

// LoadProjectsWithSkills mocks base method.
func (m *MockDatabaseRepo) LoadProjectsWithSkills() ([]*models.Project, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "LoadProjectsWithSkills")
	ret0, _ := ret[0].([]*models.Project)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// LoadProjectsWithSkills indicates an expected call of LoadProjectsWithSkills.
func (mr *MockDatabaseRepoMockRecorder) LoadProjectsWithSkills() *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "LoadProjectsWithSkills", reflect.TypeOf((*MockDatabaseRepo)(nil).LoadProjectsWithSkills))
}

// OneProject mocks base method.
func (m *MockDatabaseRepo) OneProject(id int) (*models.Project, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "OneProject", id)
	ret0, _ := ret[0].(*models.Project)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// OneProject indicates an expected call of OneProject.
func (mr *MockDatabaseRepoMockRecorder) OneProject(id interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "OneProject", reflect.TypeOf((*MockDatabaseRepo)(nil).OneProject), id)
}

// OneProjectForEdit mocks base method.
func (m *MockDatabaseRepo) OneProjectForEdit(id int) (*models.Project, []*models.Skill, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "OneProjectForEdit", id)
	ret0, _ := ret[0].(*models.Project)
	ret1, _ := ret[1].([]*models.Skill)
	ret2, _ := ret[2].(error)
	return ret0, ret1, ret2
}

// OneProjectForEdit indicates an expected call of OneProjectForEdit.
func (mr *MockDatabaseRepoMockRecorder) OneProjectForEdit(id interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "OneProjectForEdit", reflect.TypeOf((*MockDatabaseRepo)(nil).OneProjectForEdit), id)
}

// UpdateProject mocks base method.
func (m *MockDatabaseRepo) UpdateProject(project models.Project) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateProject", project)
	ret0, _ := ret[0].(error)
	return ret0
}

// UpdateProject indicates an expected call of UpdateProject.
func (mr *MockDatabaseRepoMockRecorder) UpdateProject(project interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateProject", reflect.TypeOf((*MockDatabaseRepo)(nil).UpdateProject), project)
}

// UpdateProjectSkills mocks base method.
func (m *MockDatabaseRepo) UpdateProjectSkills(id int, skillIDs []int) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateProjectSkills", id, skillIDs)
	ret0, _ := ret[0].(error)
	return ret0
}

// UpdateProjectSkills indicates an expected call of UpdateProjectSkills.
func (mr *MockDatabaseRepoMockRecorder) UpdateProjectSkills(id, skillIDs interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateProjectSkills", reflect.TypeOf((*MockDatabaseRepo)(nil).UpdateProjectSkills), id, skillIDs)
}
