import { CONFIG } from 'src/config-global';

import { AdminChatView } from 'src/sections/chat/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Chat Management - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Manage customer chat conversations and support requests"
      />
      <meta name="keywords" content="chat,support,customer service,admin" />

      <AdminChatView />
    </>
  );
}

