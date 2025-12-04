import { CONFIG } from 'src/config-global';
import { useRouter } from 'src/routing/hooks';
import { useParams } from 'react-router-dom';
import { SubcategoryEditForm } from 'src/sections/category/form';

export default function Page() {
  const router = useRouter();
  const { id } = useParams();

  const handleSuccess = () => router.push('/admin/category');
  const handleCancel = () => router.push('/admin/category');

  if (!id) {
    return null;
  }

  return (
    <>
      <title>{`Edit SubCategory - ${CONFIG.appName}`}</title>
      <SubcategoryEditForm subId={Number(id)} onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
}
