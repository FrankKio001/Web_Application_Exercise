import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Input from "./form/Input";
import Select from "./form/Select";
import TextArea from "./form/TextArea";
import Checkbox from "./form/Checkbox";
import Swal from "sweetalert2";

const EditProject = () => {
    const navigate = useNavigate();
    const { jwtToken } = useOutletContext();

    const [error, setError] = useState(null);
    const [errors, setErrors] = useState([]);

    const StatusOptions = [
        {id: "ongoing", value: "Ongoing"},
        {id: "completed", value: "Completed"},
        {id: "paused", value: "Paused"},
    ];

    const projectCategoryOptions = [
        {id: "college", value: "College"},
        {id: "personal", value: "Personal"},
        {id: "indieTeam", value: "Indie Team"},
    ];
    
    // 檢查特定欄位是否有錯誤
    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    const [project, setProject] = useState({
        id: 0,
        title: "",
        description: "",
        technologyStack: "",
        status: "",
        category: "",
        image: "",
        skills: [],
        skills_array: [],
    });

    // get id from the URL
    let {id} = useParams();
    if (id === undefined) {
        id = 0;
    }

    useEffect(() => {
        if (jwtToken === "") {
            navigate("/login");
            return;
        }

        if (id === 0) {
            // adding a project
            setProject({
                id: 0,
                title: "",
                description: "",
                technologyStack: "",
                status: "",
                category: "",
                image: "",
                skills: [],
                skills_array: [Array(20).fill(false)],
            });

            //fetch
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            fetch(`${process.env.REACT_APP_BACKEND}/skills`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    const checks = [];

                    data.forEach(g => {
                        checks.push({id: g.id, checked: false, skill: g.skill});
                    })

                    setProject(m => ({
                        ...m,
                        skills: checks,
                        skills_array: [],
                    }))
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            // editing an existing project
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Bearer " + jwtToken);

            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            fetch(`${process.env.REACT_APP_BACKEND}/admin/projects/${id}`, requestOptions)
                .then((response) => {
                    if (response.status !== 200) {
                        setError("Invalid response code: " + response.status)
                    }
                    return response.json();
                })
                .then((data) => {
                    const checks = [];

                    data.skills.forEach(g => {
                        if (data.project.skills_array.indexOf(g.id) !== -1) {
                            checks.push({id: g.id, checked: true, skill: g.skill});
                        } else {
                            checks.push({id: g.id, checked: false, skill: g.skill});
                        }
                    })

                    // set state
                    setProject({
                        ...data.project,
                        skills: checks,
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        }

    }, [id, jwtToken, navigate])

    const handleSubmit = (event) => {
        event.preventDefault();

        let errors = [];
        let required = [
            { field: project.title, name: "title"},
            { field: project.technology_stack, name: "technology_stack"},
            { field: project.status, name: "status"},
            { field: project.category, name: "category"},
            { field: project.image, name: "image"},
            { field: project.description, name: "description"},
        ]

        required.forEach(function (obj) {
            if (obj.field === "") {
                errors.push(obj.name);
            }
        })

        if (project.skills_array.length === 0) {
            ////alert
            //alert("You must choose at least one skill!");
            //errors.push("skills");
            Swal.fire({
                title: 'Error!',
                text: 'You must choose at least one skill!',
                icon: 'error',
                confirmButtonText: 'OK',
            })
            errors.push("skills");
        }

        setErrors(errors);

        if (errors.length > 0) {
            return false;
        }

        // passed validation, so save changes
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        // assume we are adding a new project
        let method = "PUT";

        if (project.id > 0) {
            method = "PATCH";
        }

        const requestBody = project;

        let requestOptions = {
            body: JSON.stringify(requestBody),
            method: method,
            headers: headers,
            credentials: "include",
        }

        fetch(`${process.env.REACT_APP_BACKEND}/admin/projects/${project.id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    navigate("/manage-catalogue");
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const handleChange = () => (event) => {
        let value = event.target.value;
        let name = event.target.name;
        setProject({
            ...project,
            [name]: value,
        })
    }

    const handleCheck = (event, position) => {
        console.log("handleCheck called");
        console.log("value in handleCheck:", event.target.value);
        console.log("checked is", event.target.checked);
        console.log("position is", position);

        let tmpArr = project.skills;
        tmpArr[position].checked = !tmpArr[position].checked;

        let tmpIDs = project.skills_array;
        if (!event.target.checked) {
            tmpIDs.splice(tmpIDs.indexOf(event.target.value));
        } else {
            tmpIDs.push(parseInt(event.target.value, 10));
        }

        setProject({
            ...project,
            skills_array: tmpIDs,
        })
    }

    const confirmDelete = () => {
        Swal.fire({
            title: 'Delete project?',
            text: "You cannot undo this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                let headers = new Headers();
                headers.append("Authorization", "Bearer " + jwtToken)
    
                const requestOptions = {
                    method: "DELETE",
                    headers: headers,
                }
    
              fetch(`${process.env.REACT_APP_BACKEND}/admin/projects/${project.id}`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        navigate("/manage-catalogue");
                    }
                })
                .catch(err => {console.log(err)});
            }
        })
    }

    if(error !== null){
        return<div>ERROR:{error.message}</div>;
    } else {
    return(
        <div>
            <h2>Add/Edit Project</h2>
            <hr />
            {/*print json*/}
            {/*<pre>{JSON.stringify(project, null, 3)}</pre>*/}

            <form onSubmit={handleSubmit}>

                <input type="hidden" name="id" value={project.id} id="id"></input>

                <Input
                    title={"Title"}
                    className={"form-control"}
                    type={"text"}
                    name={"title"}
                    value={project.title}
                    onChange={handleChange("title")}
                    errorDiv={hasError("title") ? "text-danger" : "d-none"}
                    errorMsg={"Please enter a title"}
                />

                <Input
                    title={"TechnologyStack"}
                    className={"form-control"}
                    type={"text"}
                    name={"technology_stack"}
                    value={project.technology_stack}
                    onChange={handleChange("technology_stack")}
                    errorDiv={hasError("technology_stack") ? "text-danger" : "d-none"}
                    errorMsg={"Please enter a technology_stack"}
                />

                <Input
                    title={"Image"}
                    className={"image"}
                    type={"text"}
                    name={"image"}
                    value={project.image}
                    onChange={handleChange("image")}
                    errorDiv={hasError("image") ? "text-danger" : "d-none"}
                    errorMsg={"Please enter a image"}
                />

                <Select
                    title={"Category"}
                    name={"category"}
                    value={project.category}
                    options={projectCategoryOptions}
                    onChange={handleChange("category")}
                    placeHolder={"Choose..."}
                    errorMsg={"Please choose"}
                    errorDiv={hasError("category") ? "text-danger" : "d-none"}
                />

                <Select
                    title={"Status"}
                    name={"status"}
                    value={project.status}
                    options={StatusOptions}
                    onChange={handleChange("status")}
                    placeHolder={"Choose..."}
                    errorMsg={"Please choose"}
                    errorDiv={hasError("status") ? "text-danger" : "d-none"}
                />

                <TextArea
                    title="Description"
                    name={"description"}
                    value={project.description}
                    rows={"3"}
                    onChange={handleChange("description")}
                    errorMsg={"Please enter a description"}
                    errorDiv={hasError("description") ? "text-danger" : "d-none"}
                />

                <hr />

                <h3>Skills</h3>

                {project.skills && project.skills.length > 1 &&
                    <>
                        {Array.from(project.skills).map((g, index) =>
                            <Checkbox
                                title={g.skill}
                                name={"skill"}
                                key={index}
                                id={"skill-" + index}
                                onChange={(event) => handleCheck(event, index)}
                                value={g.id}
                                checked={project.skills[index].checked}
                            />
                        )}
                    </>
                }

                <hr />

                <button className="btn btn-primary">Save</button>
                {project.id > 0 && (
                    <a href="#!" className="btn btn-danger ms-2" onClick={confirmDelete}>
                    Delete Project
                    </a>
                )}

            </form>
        </div>
    )
    }
}

export default EditProject;