// src/pages/admin/project/[id].js
import { useRouter } from 'next/router';
import EditProject from '../../../components/EditProject';

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!router.isReady) return null;
  
  return <EditProject projectId={id} />;
}
