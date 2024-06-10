// src/components/Skills.js
import Link from 'next/link';

// 屬性skills
const Skills = ({ skills }) => {
  return (
    <div>
      <h2>Skills</h2>
      <hr />
      <div className="list-group">
        {skills.map((g) => (
          <Link
            key={g.id}
            href={`/skills/${g.id}`}
            className="list-group-item list-group-item-action"
          >
            {g.skill_name}
          </Link>
        ))}
      </div>
    </div>
  );
};

//getStaticProps 靜態生成頁面
//異步async
export async function getStaticProps() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/skills`);
    if (!response.ok) {
      throw new Error('Failed to fetch skills');// 失敗
    }
    const skills = await response.json();// 解析技能數據

    return {
      props: {
        skills,// 傳遞給頁面
      },
      revalidate: 10, // Revalidate at most once every 10 seconds
    };
  } catch (error) {
    return {
      props: {
        skills: [],//發生錯誤，傳遞空的技能
        error: error.message,
      },
    };
  }
}

export default Skills;
