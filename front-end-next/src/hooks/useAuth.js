//傳JWT用
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { MyAppContext } from '../pages/_app';

const fetchProjects = async (jwtToken) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${jwtToken}`,
  });

  const requestOptions = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/admin/projects`, requestOptions);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to fetch projects');
  }
  return response.json();
};

const ManageCataloguePage = ({ initialProjects, initialJwtToken }) => {
  const { jwtToken } = useContext(MyAppContext);
  const router = useRouter();

  const { data: projects, error } = useQuery(
    ['projects', jwtToken],
    () => fetchProjects(jwtToken),
    {
      initialData: initialProjects,
      enabled: !!jwtToken,
    }
  );

  useEffect(() => {
    if (!jwtToken) {
      router.push('/login');
    }
  }, [jwtToken, router]);

  if (!jwtToken) {
    return null;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Manage Catalogue</h2>
      <hr />
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Project</th>
            <th>Status</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              <td>
                <Link href={`/admin/project/${project.id}`}>
                  <a>{project.title}</a>
                </Link>
              </td>
              <td>{project.status}</td>
              <td>{project.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export async function getStaticProps() {
  try {
    const jwtToken = process.env.JWT_TOKEN; // or retrieve it from a secure place

    const headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwtToken}`,
    });

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/admin/projects`, requestOptions);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch projects');
    }
    const projects = await response.json();

    return {
      props: {
        initialProjects: projects,
        initialJwtToken: jwtToken
      },
      revalidate: 10, // Revalidate at most once every 10 seconds
    };
  } catch (error) {
    return {
      props: {
        initialProjects: [],
        initialJwtToken: "",
        error: error.message,
      },
    };
  }
}

export default ManageCataloguePage;
