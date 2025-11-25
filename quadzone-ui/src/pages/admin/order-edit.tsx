import { CONFIG } from 'src/config-global';
import { useParams } from 'react-router-dom';
import { useRouter } from 'src/routing/hooks';
import { OrderEditForm } from 'src/sections/order/form';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/order');
  };

  const handleCancel = () => {
    router.push('/admin/order');
  };

  if (!id) {
    return null;
  }

  return (
    <>
      <title>{`Edit Order - ${CONFIG.appName}`}</title>
      <OrderEditForm orderId={id} onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
}
