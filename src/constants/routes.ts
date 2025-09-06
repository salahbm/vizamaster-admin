// Define routes and navigation structure

export const routes = {
  home: '/',
  signIn: '/sign-in',
  dashboard: '/dashboard',
  users: '/users',
  documents: '/documents',
  settings: '/settings',
  profile: '/profile',
  admins: '/admins',
  companyInfo: '/company/info',
  companyStorefront: '/company/storefront',
  products: '/products',
};

export interface SideNavItem {
  href: string;
  label: string;
  icon: string;
  children?: SideNavItem[];
}

// Define the navigation items
export const SIDENAV: SideNavItem[] = [
  {
    href: routes.dashboard,
    label: 'dashboard',
    icon: 'LayoutDashboard',
  },
  {
    href: routes.users,
    label: 'users',
    icon: 'Users',
  },
  {
    href: routes.documents,
    label: 'documents',
    icon: 'FileText',
  },
  {
    href: routes.settings,
    label: 'settings',
    icon: 'Settings',
    children: [
      {
        href: routes.profile,
        label: 'profile',
        icon: 'User',
      },
      {
        href: routes.admins,
        label: 'admins',
        icon: 'Users',
      },
    ],
  },
];
