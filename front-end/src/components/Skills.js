import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    fetch(`${process.env.REACT_APP_BACKEND}/skills`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.message);
        } else {
          setSkills(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (error !== null) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <div>
        <h2>Skills</h2>
        <hr />

        <div className="list-group">
            {skills.map((g) => (
                <Link
                    key={g.id}
                    className="list-group-item list-group-item-action"
                    to={`/skills/${g.id}`}
                    state={
                        {
                            skillName: g.skill_name,
                        }
                    }
                    >{g.skill_name}</Link>
            ))}
        </div>
      </div>
    );
  }
};

export default Skills;
