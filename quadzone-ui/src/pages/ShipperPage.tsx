import { CONFIG } from 'src/config-global';

import { ShipperOrderView } from 'src/sections/order/view/shipper-order-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Shipper Orders - ${CONFIG.appName}`}</title>

      <ShipperOrderView />
    </>
  );
}
