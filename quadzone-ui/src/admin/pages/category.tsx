import { CONFIG } from 'src/config-global';

import { CategoryView } from 'src/sections/category/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Categories - ${CONFIG.appName}`}</title>

      <CategoryView />
    </>
  );
}

