// src/pages/admin/project/[id].js
/*
import { useRouter } from 'next/router';
import EditProject from '../../../components/EditProject';
//import { QueryClient, dehydrate } from '@tanstack/react-query';

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!router.isReady) return null;
  
  return <EditProject projectId={id} />;
}
*/
/*
import EditProject from '../../../components/EditProject';
export default function EditProjectPage({ dehydratedState }) {
  const router = useRouter();
  const { id } = router.query;

  if (!router.isReady) return null;
  
  return <EditProject projectId={id} dehydratedState={dehydratedState} />;
}

export async function getServerSideProps({ params }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['project', params.id], () => fetchProjectData(params.id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
*/
import { useRouter } from 'next/router';
import EditProject from '../../../components/EditProject';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { parseCookies } from 'nookies';

const fetchProjectData = async (id, jwtToken) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/admin/projects/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch project data');
    }

    return response.json();
};

export async function getServerSideProps(context) {
    const { id } = context.params;
    const cookies = parseCookies(context);
    const jwtToken = cookies.jwt;

    if (!jwtToken) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(['project', id], () => fetchProjectData(id, jwtToken));

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            id, // 傳遞PROJECT ID
            jwtToken, // 傳遞 JWT token 給COMPONENTS
        },
    };
}

const EditProjectPage = ({ id, jwtToken, dehydratedState }) => {
    const router = useRouter();

    if (!router.isReady) return null;

    return <EditProject projectId={id} jwtToken={jwtToken} dehydratedState={dehydratedState} />;
};

export default EditProjectPage;
