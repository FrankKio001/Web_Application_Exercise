import Link from 'next/link';

const OneSkill = ({ skillName, projects, error }) => {
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!projects || projects.length === 0) {
    return <div>No projects in this skill (yet)!</div>;// 無項目訊息
  }

  return (
    <>
      <h2>Skill: {skillName}</h2>
      <hr />
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
                <Link href={`/projects/${m.id}`} passHref>
                  <a>{m.title}</a>
                </Link>
              </td>
              <td>{m.status}</td>
              <td>{m.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
//debug 用
/*
export async function getServerSideProps({ params }) {
  const fetchWithRetry = async (url, options, retries = 3) => {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        if (retries > 0) {
          console.warn(`Rate limit exceeded, retrying... (${retries} retries left)`);
          await new Promise(res => setTimeout(res, 3000));
          return fetchWithRetry(url, options, retries - 1);
        } else {
          throw new Error('Rate limit exceeded, no retries left');
        }
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch, status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  try {
    console.log('Fetching skill:', params.id);// 紀錄正在獲取的技能
    const skills = await fetchWithRetry(`${process.env.NEXT_PUBLIC_BACKEND}/skills`);
    console.log('Skills fetched:', skills);
    const skill = skills.find(skill => skill.id.toString() === params.id);

    if (!skill) {
      throw new Error('Skill not found');// 若技能未找到則拋出錯誤
    }

    console.log('Fetching projects for skill:', params.id);// 紀錄正在獲取的項目
    const projects = await fetchWithRetry(`${process.env.NEXT_PUBLIC_BACKEND}/projects/skills/${params.id}`);
    console.log('Projects fetched:', projects);

    return {
      props: {
        skillName: skill.skill_name,// 傳遞技能名稱
        projects,
      },
    };
  } catch (error) {
    console.error('Error fetching skill or projects:', error);// 紀錄獲取技能或項目時的錯誤
    return {
      props: {
        skillName: 'Unknown Skill',
        projects: [],
        error: error.message,// 傳遞錯誤訊息
      },
    };
  }
}
*/
export default OneSkill;
