import { CONFIG } from 'src/config-global';
import { useRouter } from 'src/routing/hooks';
import { CategoryCreateForm } from 'src/sections/category/form';

// ----------------------------------------------------------------------

export default function Page() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/category');
  };

  const handleCancel = () => {
    router.push('/admin/category');
  };

  return (
    <>
      <title>{`Create Category - ${CONFIG.appName}`}</title>
      <CategoryCreateForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
}
