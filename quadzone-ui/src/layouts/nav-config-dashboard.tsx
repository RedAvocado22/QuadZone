import { SvgColor } from 'src/components/svg-color';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/admin',
    icon: icon('ic-analytics'),
  },
  {
    title: 'User',
    path: '/admin/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Product',
    path: '/admin/products',
    icon: icon('ic-cart'),
  },
  {
    title: 'Blog',
    path: '/admin/blog',
    icon: icon('ic-blog'),
  },
  {
    title: 'Category',
    path: '/admin/category',
    icon: <Iconify width={24} icon="solar:folder-bold-duotone" />,
  },
  {
    title: 'Order',
    path: '/admin/order',
    icon: <Iconify width={24} icon="solar:bag-check-bold-duotone" />,
  },
];
