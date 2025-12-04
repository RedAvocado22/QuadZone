import { CONFIG } from 'src/config-global';

import { CouponView } from 'src/sections/coupon/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Coupons - ${CONFIG.appName}`}</title>

      <CouponView />
    </>
  );
}

