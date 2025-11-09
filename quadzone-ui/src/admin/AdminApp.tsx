import 'src/global.css';

import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { ThemeProvider } from 'src/theme/theme-provider';

// ----------------------------------------------------------------------

type AdminAppProps = {
  children: React.ReactNode;
};

export default function AdminApp({ children }: AdminAppProps) {
  useScrollToTop();

  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

