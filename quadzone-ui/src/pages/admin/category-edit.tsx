import { CONFIG } from 'src/config-global';
import { useParams } from 'react-router-dom';
import { useRouter } from 'src/routing/hooks';
import { CategoryEditForm } from 'src/sections/category/form';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/category');
  };

  const handleCancel = () => {
    router.push('/admin/category');
  };

  if (!id) {
    return null;
  }

  return (
    <>
      <title>{`Edit Category - ${CONFIG.appName}`}</title>
      <CategoryEditForm categoryId={Number(id)} onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
}
