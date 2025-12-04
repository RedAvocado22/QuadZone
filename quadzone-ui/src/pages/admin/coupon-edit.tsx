import { CONFIG } from 'src/config-global';
import { useParams } from 'react-router-dom';
import { useRouter } from 'src/routing/hooks';
import { CouponEditForm } from 'src/sections/coupon/form';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/coupon');
  };

  const handleCancel = () => {
    router.push('/admin/coupon');
  };

  if (!id) {
    return null;
  }

  return (
    <>
      <title>{`Edit Coupon - ${CONFIG.appName}`}</title>
      <CouponEditForm couponId={id} onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
}

