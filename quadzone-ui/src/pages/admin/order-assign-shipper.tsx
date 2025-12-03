import { CONFIG } from 'src/config-global';
import { useParams } from 'react-router-dom';
import { useRouter } from 'src/routing/hooks';
import { OrderAssignShipperForm } from 'src/sections/order/form';

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
      <title>{`Assign Order to Shipper - ${CONFIG.appName}`}</title>
      <OrderAssignShipperForm orderId={id} onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
}

