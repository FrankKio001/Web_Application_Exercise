import { useEffect, useState } from "react";
import Link from 'next/link';

const Projects = ({ projects }) => {
    return (
        <div>
            <h2>Projects</h2>
            <hr />
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Status</th>
                        <th>LastUpdated</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((m) => (
                        <tr key={m.id}>
                            <td>
                                <Link href={`/projects/${m.id}`}>
                                    {m.title}
                                </Link>
                            </td>
                            <td>{m.status}</td>
                            <td>{m.updated_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Projects;
