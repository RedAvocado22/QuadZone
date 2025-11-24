import { CONFIG } from 'src/config-global';
import { PostDetailsView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Post Details - ${CONFIG.appName}`}</title>
      <PostDetailsView />
    </>
  );
}
