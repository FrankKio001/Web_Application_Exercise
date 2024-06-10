import Projects from '../../components/Projects';

const ProjectsPage = ({ projects, error }) => {
    if (error) {
        return <div>Error: {error}</div>;
    }

    return <Projects projects={projects} />;
};

//debug server print

export async function getServerSideProps() {
    try {
        console.log(`Backend URL: ${process.env.NEXT_PUBLIC_BACKEND}`);
        console.log('Fetching projects...');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/projects`, {
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        const projects = await response.json();

        return {
            props: {
                projects,
            },
        };
    } catch (error) {
        return {
            props: {
                projects: [],
                error: error.message,
            },
        };
    }
}


export default ProjectsPage;
