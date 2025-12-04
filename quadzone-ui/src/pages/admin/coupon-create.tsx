import { CONFIG } from 'src/config-global';
import { useRouter } from 'src/routing/hooks';
import { CouponCreateForm } from 'src/sections/coupon/form';

// ----------------------------------------------------------------------

export default function Page() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/coupon');
  };

  const handleCancel = () => {
    router.push('/admin/coupon');
  };

  return (
    <>
      <title>{`Create Coupon - ${CONFIG.appName}`}</title>
      <CouponCreateForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
}

