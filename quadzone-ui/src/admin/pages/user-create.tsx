import { CONFIG } from 'src/config-global';
import { useRouter } from 'src/routes/hooks';
import { UserCreateForm } from 'src/sections/user/form';

// ----------------------------------------------------------------------

export default function Page() {
  const router = useRouter();

  const handleSuccess = () => {
    // Navigate back to user list after successful creation
    router.push('/admin/user');
  };

  const handleCancel = () => {
    // Navigate back to user list
    router.push('/admin/user');
  };

  return (
    <>
      <title>{`Create User - ${CONFIG.appName}`}</title>

      <UserCreateForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
}

