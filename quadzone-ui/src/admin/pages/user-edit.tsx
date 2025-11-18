import { useParams } from 'react-router-dom';
import { CONFIG } from 'src/config-global';
import { useRouter } from 'src/routes/hooks';
import { UserEditForm } from 'src/sections/user/form';

// ----------------------------------------------------------------------

export default function Page() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <>
        <title>{`Edit User - ${CONFIG.appName}`}</title>
        <div>User ID is required</div>
      </>
    );
  }

  const handleSuccess = () => {
    // Navigate back to user list after successful update
    router.push('/admin/user');
  };

  const handleCancel = () => {
    // Navigate back to user list
    router.push('/admin/user');
  };

  return (
    <>
      <title>{`Edit User - ${CONFIG.appName}`}</title>

      <UserEditForm userId={id} onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
}

