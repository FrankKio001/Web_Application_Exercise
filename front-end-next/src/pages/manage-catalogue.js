import { parseCookies } from 'nookies';
import ManageCatalogueComponent from '../components/ManageCatalogue';

export async function getServerSideProps(context) {
  // 從請求中提取 cookies
  const cookies = parseCookies(context);
  const jwtToken = cookies.jwt;

  if (!jwtToken) {
    // 如果沒有 JWT token，重定向去登錄頁
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    // 使用 JWT token 去 fetch 數據
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/admin/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    const projects = await response.json();
    return {
      props: { projects },
    };
  } catch (error) {
    // err
    return {
      props: { projects: [], error: error.message },
    };
  }
}

const ManageCataloguePage = ({ projects, error }) => {
  // 處理顯示錯誤
  if (error) {
    return <div>Error: {error}</div>;
  }

  return <ManageCatalogueComponent projects={projects} />;
};

export default ManageCataloguePage;
