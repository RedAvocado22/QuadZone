import { CONFIG } from 'src/config-global';
import { useParams } from 'react-router-dom';
import { useRouter } from 'src/routing/hooks';
import { BlogEditForm } from 'src/sections/blog/form/blog-edit-form';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/blog');
  };

  const handleCancel = () => {
    router.push('/admin/blog');
  };

  if (!id) {
    return null;
  }

  return (
    <>
      <title>{`Edit Blog - ${CONFIG.appName}`}</title>
      <BlogEditForm blogId={Number.parseInt(id, 10)} onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
}
