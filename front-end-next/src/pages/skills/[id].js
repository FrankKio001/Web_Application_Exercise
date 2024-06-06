import OneSkill from '../../components/OneSkill';

const SkillsPage = ({ skillName, projects, error }) => {
  return <OneSkill skillName={skillName} projects={projects} error={error} />;
};

//debug server

export async function getServerSideProps({ params }) {
  //重試功能
  const fetchWithRetry = async (url, options, retries = 3) => {
    try {
      const response = await fetch(url, options);
      //429的情況
      if (response.status === 429) {
        if (retries > 0) {
          console.warn(`Rate limit exceeded, retrying... (${retries} retries left)`);
          await new Promise(res => setTimeout(res, 3000));//// 等待 3 秒
          return fetchWithRetry(url, options, retries - 1);
        } else {
          throw new Error('Rate limit exceeded, no retries left');// 沒有重試次數時拋出錯誤
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
    console.log('Fetching skill:', params.id); // 記錄正在獲取的技能
    const skills = await fetchWithRetry(`${process.env.NEXT_PUBLIC_BACKEND}/skills`);
    console.log('Skills fetched:', skills); // 記錄獲取的技能數據
    const skill = skills.find(skill => skill.id.toString() === params.id);

    if (!skill) {
      throw new Error('Skill not found');
    }

    console.log('Fetching projects for skill:', params.id);// 記錄正在獲取的項目
    const projects = await fetchWithRetry(`${process.env.NEXT_PUBLIC_BACKEND}/projects/skills/${params.id}`);
    console.log('Projects fetched:', projects);// 記錄獲取的項目數據

    return {
      props: {
        skillName: skill.skill_name,// 傳遞技能名稱
        projects, // 傳遞項目數據
      },
    };
  } catch (error) {
    console.error('Error fetching skill or projects:', error);// 記錄獲取技能或項目時的錯誤
    return {
      props: {
        skillName: 'Unknown Skill',// 錯誤
        projects: [],
        error: error.message,
      },
    };
  }
}


export default SkillsPage;
