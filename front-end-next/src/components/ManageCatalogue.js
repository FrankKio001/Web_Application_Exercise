// components/ManageCatalogue.js
import React from 'react';
import Link from 'next/link';

const ManageCatalogue = ({ projects }) => {
    if (!projects || projects.length === 0) {
        return <div>No projects found</div>;
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
                                <Link href={`/admin/project/${project.id}`} passHref>
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

export default ManageCatalogue;