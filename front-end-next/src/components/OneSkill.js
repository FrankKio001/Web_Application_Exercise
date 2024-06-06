import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';


const OneSkill = () => {
    // we need to get the "prop" passed to this component
    const router = useRouter();
    const { id } = router.query;
    const skillName = router.query.skillName || 'Skill';

    // set stateful variables
    const [projects, setProjects] = useState([]);

    // useEffect to get list of projects
    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json")
        
        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`${process.env.NEXT_PUBLIC_BACKEND}/projects/skills/${id}`, requestOptions)
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

            ) : (
                <p>No projects in this skill (yet)!</p>
            )}
        </>
    )
}

export default OneSkill;