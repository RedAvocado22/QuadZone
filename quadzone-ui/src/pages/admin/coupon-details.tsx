import { CONFIG } from 'src/config-global';
import { CouponDetailsView } from 'src/sections/coupon/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Coupon Details - ${CONFIG.appName}`}</title>
      <CouponDetailsView />
    </>
  );
}

