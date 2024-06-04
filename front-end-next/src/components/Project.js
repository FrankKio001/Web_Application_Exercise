import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Image from 'next/image';

const Project = () => {
    const [project, setProject] = useState({});
    const router = useRouter();
    const { id } = router.query;
    
    useEffect(() => {
        if (typeof id !== 'undefined') {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            fetch(`${process.env.NEXT_PUBLIC_BACKEND}/projects/${id}`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setProject(data);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [id])

    if (project.skills) {
        project.skills = Object.values(project.skills);
    } else {
        project.skills = [];
    }

    return(
        <div>
            <h2>Project: {project.title}</h2>
            <p><strong>Technology Stack:</strong> {project.technology_stack}</p>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Category:</strong> {project.category}</p>

            {/* Display skills if available */}
            {project.skills && project.skills.length > 0 && (
                <div>
                    <h5>Skills</h5>
                    {project.skills.map((skill) => (
                        <span key={skill.id} className="badge bg-secondary me-2">{skill.skill_name}</span>
                    ))}
                </div>
            )}


            {/* {project.image && project.image.startsWith("http"||"https") && */}
            {project.image &&
                <div className="mb-3">
                    <Image src={"https://images.weserv.nl/?url="+"https://drive.usercontent.google.com/download?id=" + project.image} alt="Project poster" />
                </div>
            }

            <p>{project.description}</p>
        </div>
    )
}

export default Project;