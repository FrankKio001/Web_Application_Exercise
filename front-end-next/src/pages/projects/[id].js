import Project from '../../components/Project';

const ProjectPage = ({ project, error }) => {
    return <Project project={project} error={error} />;
};

//debug server
export async function getServerSideProps({ params }) {
    // 重試_因為有限429
    const fetchWithRetry = async (url, options, retries = 3) => {
        try {
            const response = await fetch(url, options);
            if (response.status === 429) {
                if (retries > 0) {
                    console.warn(`Rate limit exceeded, retrying... (${retries} retries left)`);
                    await new Promise(res => setTimeout(res, 3000));
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
        console.log('Fetching project:', params.id);// 記錄正在獲取的項目
        const project = await fetchWithRetry(`${process.env.NEXT_PUBLIC_BACKEND}/projects/${params.id}`);
        console.log('Project fetched:', project);// 記錄獲取的項目數據

        return {
            props: {
                project,// 傳遞項目數據
            },
        };
    } catch (error) {
        console.error('Error fetching project:', error);// 記錄獲取項目時的錯誤
        return {
            props: {
                project: null,
                error: error.message,// 傳遞錯誤訊息
            },
        };
    }
}


export default ProjectPage;
