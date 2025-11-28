import { CONFIG } from 'src/config-global';

import { OrderAssignDeliveryView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Assign Delivery - ${CONFIG.appName}`}</title>

      <OrderAssignDeliveryView />
    </>
  );
}

