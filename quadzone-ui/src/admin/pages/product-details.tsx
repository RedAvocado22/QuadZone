import { CONFIG } from 'src/config-global';
import { ProductDetailsView } from 'src/sections/product/view/product-details-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Product Details - ${CONFIG.appName}`}</title>
      <ProductDetailsView />
    </>
  );
}

