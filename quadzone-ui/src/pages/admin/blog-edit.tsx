import { CONFIG } from 'src/config-global';
import { useParams } from 'react-router-dom';
import { useRouter } from 'src/routing/hooks';
import { PostEditForm } from 'src/sections/blog/form';

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
      <title>{`Edit Post - ${CONFIG.appName}`}</title>
      <PostEditForm postId={id} onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
}
