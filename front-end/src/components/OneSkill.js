import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom"


const OneSkill = () => {
    // we need to get the "prop" passed to this component
    const location = useLocation();
    const { skillName } = location.state;

    // set stateful variables
    const [projects, setProjects] = useState([]);

    // get the id from the url
    let { id } = useParams();

    // useEffect to get list of projects
    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json")
        
        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`${process.env.REACT_APP_BACKEND}/projects/skills/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.message);
                } else {
                    setProjects(data);
                }
            })
            .catch(err => {console.log(err)});
    }, [id])

    // return jsx
    return (
        <>
            <h2>Skill: {skillName}</h2>

            <hr />

            {projects ? (
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Status</th>
                        <th>UpdatedAt</th>
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

            ) : (
                <p>No projects in this skill (yet)!</p>
            )}
        </>
    )
}

export default OneSkill;