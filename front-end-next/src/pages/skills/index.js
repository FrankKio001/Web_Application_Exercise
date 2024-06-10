import Skills from '../../components/Skills';

const SkillsPage = ({ skills, error }) => {
  if (error) {
    return <div>Error: {error}</div>;
  }

  return <Skills skills={skills} />;
};

//debug server print

export async function getServerSideProps() {
  try {
    console.log('Fetching skills...');
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/skills`);
    if (!response.ok) {
      throw new Error('Failed to fetch skills');
    }
    const skills = await response.json();

    return {
      props: {
        skills,
      },
    };
  } catch (error) {
    return {
      props: {
        skills: [],
        error: error.message,
      },
    };
  }
}

export default SkillsPage;
