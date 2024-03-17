import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Projects = () => {
    const [projects, setProjects] = useState([]);

    useEffect( () => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`${process.env.REACT_APP_BACKEND}/projects`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setProjects(data);
            })
            .catch(err => {
                console.log(err);
            })

    }, []);

    return(
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
                                <Link to={`/projects/${m.id}`}>
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
    )
}

export default Projects;