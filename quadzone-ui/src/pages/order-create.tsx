import { CONFIG } from 'src/config-global';
import { useRouter } from 'src/routes/hooks';
import { OrderCreateForm } from 'src/sections/order/form';

// ----------------------------------------------------------------------

export default function Page() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/order');
  };

  const handleCancel = () => {
    router.push('/admin/order');
  };

  return (
    <>
      <title>{`Create Order - ${CONFIG.appName}`}</title>
      <OrderCreateForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
}
