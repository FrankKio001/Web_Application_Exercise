import Home from '../components/Home';
import GraphQL from '../components/GraphQL';

export async function getServerSideProps() {
    const fetchSkills = async () => {
        return fetch(`${process.env.NEXT_PUBLIC_BACKEND}/skills`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
        .then(response => response.json())
        .catch(err => {
            console.error("Failed to fetch skills", err);
            return [];
        });
    };

    const fetchGraphQL = async (query) => {
        return fetch(`${process.env.NEXT_PUBLIC_BACKEND}/graph`, {
            method: "POST",
            headers: { "Content-Type": "application/graphql" },
            body: query,
        })
        .then(response => response.json())
        .then(response => response.data)
        .catch(err => {
            console.error("GraphQL 查询失败", err);
            return {};
        });
    };

    const projectsQuery = `
    {
        list {
            id
            title
            description
            technology_stack
            status
            category
            skills {
                id
                skill_name
            }
        }
    }`;

    const [projectsData, skillsData] = await Promise.all([
        fetchGraphQL(projectsQuery),
        fetchSkills()
    ]);

    //console.log("Projects Data:", projectsData);
    //console.log("Skills Data:", skillsData);

    return {
        props: {
            initialProjects: projectsData?.list || [],
            initialSkillList: skillsData || [],
        },
    };
}

export default function Index({ initialProjects, initialSkillList }) {
    return (
      <>
        <Home />
        <GraphQL initialProjects={initialProjects} initialSkillList={initialSkillList} />;
      </>
    );
}