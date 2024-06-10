import Image from 'next/image';

const Project = ({ project, error }) => {
    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!project) {
        return <div>No project found.</div>;
    }

    if (project.skills) {
        project.skills = Object.values(project.skills);
    } else {
        project.skills = [];
    }

    return (
        <div>
            <h2>Project: {project.title}</h2>
            <p><strong>Technology Stack:</strong> {project.technology_stack}</p>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Category:</strong> {project.category}</p>

            {/* Display skills if available */}
            {project.skills.length > 0 && (
                <div>
                    <h5>Skills</h5>
                    {project.skills.map((skill) => (
                        <span key={skill.id} className="badge bg-secondary me-2">{skill.skill_name}</span>
                    ))}
                </div>
            )}

            {project.image && (
                <div className="mb-3">
                    <Image 
                        src={"https://images.weserv.nl/?url=" + encodeURIComponent("https://drive.usercontent.google.com/download?id=" + project.image)} 
                        alt="Project poster" 
                        width={600} 
                        height={400} 
                    />
                </div>
            )}

            <p>{project.description}</p>
        </div>
    );
};

export default Project;
