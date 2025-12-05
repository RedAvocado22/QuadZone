import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------


export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'My Orders',
    path: '/shipper',
    icon: <Iconify width={24} icon="solar:bag-check-bold-duotone" />,
  },
];
