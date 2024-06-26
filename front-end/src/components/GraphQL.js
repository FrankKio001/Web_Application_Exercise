import { useEffect, useState , useCallback} from "react";
import { Link } from "react-router-dom";

const GraphQL = () => {
    // set up stateful variables
    const [projects, setProjects] = useState([]);
    const [skillList, setSkillList] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState("");

    const fetchGraphQL = useCallback((query) => {
        return fetch(`${process.env.REACT_APP_BACKEND}/graph`, {
            method: "POST",
            headers: { "Content-Type": "application/graphql" },
            body: query,
        })
        .then(response => response.json())
        .then(response => response.data)
        .catch(err => console.error("GraphQL query failed", err));
    },[]);

    // loadAllProjects
    const loadAllProjects = useCallback(() => {
        const query = `
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

        fetchGraphQL(query).then(data => {
            setProjects(data.list || []);
        });
    },[fetchGraphQL]);

    // perform a search
    const performSearch = useCallback((selectedSkill) => {
        const query = `
        {
            search(skillContains: "${selectedSkill}") {
                id
                title
                description
                technology_stack
                status
                category
                image
                skills {
                    id
                    skill_name
                }
            }
        }`;

        fetchGraphQL(query).then(data => {
            /*debug
            const projectsFound = data.search || [];
            console.log(`Number of projects found: ${selectedSkill}`);
            console.log(`Number of projects found: ${projectsFound.length}`);
            setProjects(projectsFound);
            */
            setProjects(data.search || []);
        });
    },[fetchGraphQL]);

    // 取得全部技能列表
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND}/skills`)
            .then(response => response.json())
            .then(data => {
                //console.log("Skills data: ", data);//debug
                setSkillList(data);
            })
            .catch(error => console.error("Fetching skills failed", error));
    }, []);

    // initial loading of all projects.
    useEffect(() => {
        loadAllProjects();
    }, [loadAllProjects]);

    //skill改變
    const handleSkillChange = (event) => {
        //事件冒泡
        //event.preventDefault();

        let value = event.target.value;
        setSelectedSkill(value);
        if (value === "") {
            loadAllProjects();
        }else{
            //console.log("Selected skill: ", value); //debug
            performSearch(value);
        }
    };

    return(
        <div>
            <div className="line-container">
                <h6 className="line">SOME OF MY WORK</h6>
            </div>
            {/* 技能選擇下拉清單 */}
            <div className="d-flex justify-content-center">
                <select className="form-select skill-select" value={selectedSkill} onChange={handleSkillChange}>
                    <option value="">ALL</option>
                    {skillList.map(skill => (
                        <option key={skill.id} value={skill.skill_name}>{skill.skill_name}</option>
                    ))}
                </select>
            </div>

            {/* 項目清單 */}
            {projects ? (
                <div className="mt-4">
                    {projects.map((project) => (
                        <div key={project.id} className="card mb-3">
                            <Link to={`/projects/${project.id}`}>
                            <div className="card-body">
                                <h5 className="card-title">{project.title}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{project.technology_stack}</h6>
                                <p className="card-text">{project.description}</p>
                                <p className="card-text">Category: {project.category}, Status: {project.status}</p>
                                <p className="card-text">
                                    Skills: {project.skills?.map(skill => skill.skill_name).join(', ') || 'No skills'}
                                </p>
                            </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No projects found for selected skill!</p>
            )}
        </div>
    )
}

export default GraphQL;