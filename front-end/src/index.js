import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import EditProject from './components/EditProject';
import ErrorPage from './components/ErrorPage';
import Skills from './components/Skills';
import GraphQL from './components/GraphQL';
import Home from './components/Home';
import Login from './components/Login';
import ManageCatalogue from './components/ManageCatalogue';
import Projects from './components/Projects';
import Project from './components/Project';
import OneSkill from './components/OneSkill';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: (
        <>
          <Home />
          <GraphQL />
        </>
      ) },
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/projects/:id",
        element: <Project />,
      },
      {
        path: "/skills",
        element: <Skills />,
      },
      {
        path: "/skills/:id",
        element: <OneSkill />
      },
      {
        path: "/admin/project/0",
        element: <EditProject />,
      },
      {
        path: "/admin/project/:id",
        element: <EditProject />,
      },
      {
        path: "/manage-catalogue",
        element: <ManageCatalogue />,
      },
      {
        path: "/graphql",
        element: <GraphQL />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
