import { useEffect, useState, useCallback } from "react";
import Link from 'next/link';

const GraphQL = ({ initialProjects, initialSkillList }) => {
    // 設置狀態變數
    const [projects, setProjects] = useState(initialProjects);
    const [skillList] = useState(initialSkillList);
    const [selectedSkill, setSelectedSkill] = useState("");

    // 定義 fetchGraphQL 函數以執行 GraphQL 查詢
    const fetchGraphQL = useCallback((query) => {
        return fetch(`${process.env.NEXT_PUBLIC_BACKEND}/graph`, {
            method: "POST",
            headers: { "Content-Type": "application/graphql" },
            body: query,
        })
        .then(response => response.json())
        .then(response => response.data)
        .catch(err => console.error("GraphQL 查詢失敗", err));
    }, []);

    // 加載所有項目的函數
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
            //console.log("All Projects Data:", data);
            setProjects(data?.list || []);
        });
    }, [fetchGraphQL]);

    // 執行搜索的函數
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
            
            const projectsFound = data?.search || [];
            /*
            console.log(`找到的項目數量: ${selectedSkill}`);
            console.log(`找到的項目數量: ${projectsFound.length}`);
            */
            setProjects(projectsFound);
            
            //console.log("Search Projects Data:", data);
            //setProjects(data?.search || []);
        });
    }, [fetchGraphQL]);

    // // 取得全部技能列表
    // useEffect(() => {
    //     fetch(`${process.env.NEXT_PUBLIC_BACKEND}/skills`)
    //         .then(response => response.json())
    //         .then(data => {
    //             //console.log("技能數據: ", data);//debug
    //             setSkillList(data);
    //         })
    //         .catch(error => console.error("獲取技能失敗", error));
    // }, []);

    // // 初始加載所有項目
    // useEffect(() => {
    //     loadAllProjects();
    // }, [loadAllProjects]);

    // 處理技能改變事件
    const handleSkillChange = (event) => {
        // 事件冒泡
        // event.preventDefault();

        let value = event.target.value;
        setSelectedSkill(value);
        if (value === "") {
            loadAllProjects();
        } else {
            //console.log("選擇的技能: ", value); //debug
            performSearch(value);
        }
    };
    //console.log("Skill List:", skillList);
    //console.log("Projects:", projects);
    return (
        <div>
            <div className="line-container">
                <h6 className="line">SOME OF MY WORK</h6>
            </div>
            {/* 技能選擇下拉選單 */}
            <div className="d-flex justify-content-center">
                <div className="d-flex-inner">
                    <select className="form-select skill-select" value={selectedSkill} onChange={handleSkillChange}>
                        <option value="">ALL</option>
                        {skillList.map(skill => (
                            <option key={skill.id} value={skill.skill_name}>{skill.skill_name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 項目列表 */}
            {projects.length > 0 ? (
                <div className="grid">
                    {projects.map((project) => (
                        <div key={project.id} className="card">
                            <Link href={`/projects/${project.id}`}>
                                <a className="card-link">
                                    <div className="card-body">
                                        <h5 className="card-title">{project.title}</h5>
                                        <h6 className="card-subtitle text-muted">{project.technology_stack}</h6>
                                        <p className="card-text">{project.description}</p>
                                        <p className="card-text">
                                            Category: {project.category}, Status: {project.status}
                                        </p>
                                        <div className="skills">
                                            {project.skills && project.skills.map(skill => (
                                                <span key={skill.id} className="skill-tag">{skill.skill_name}</span>
                                            ))}
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">No projects found for selected skill!</p>
            )}
        </div>
    );
}

export default GraphQL;
