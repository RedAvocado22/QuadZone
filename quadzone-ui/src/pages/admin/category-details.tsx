import { CONFIG } from 'src/config-global';
import { CategoryDetailsView } from 'src/sections/category/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Category Details - ${CONFIG.appName}`}</title>
      <CategoryDetailsView />
    </>
  );
}
