import { CONFIG } from 'src/config-global';
import { OrderDetailsView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Order Details - ${CONFIG.appName}`}</title>
      <OrderDetailsView />
    </>
  );
}
