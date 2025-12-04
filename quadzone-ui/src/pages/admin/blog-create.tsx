import { CONFIG } from 'src/config-global';
import { useRouter } from 'src/routing/hooks';
import { BlogCreateForm } from 'src/sections/blog/form';

// ----------------------------------------------------------------------

export default function Page() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/blog');
  };

  const handleCancel = () => {
    router.push('/admin/blog');
  };

  return (
    <>
      <title>{`Create Post - ${CONFIG.appName}`}</title>
      <BlogCreateForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
}
