// Define routes and navigation structure

export const routes = {
  home: '/',
  signIn: '/sign-in',
  dashboard: '/dashboard',
  users: '/users',
  documents: '/documents',
  settings: '/settings',
  profile: '/settings/profile',
  admins: '/settings/admins',
  preferences: '/settings/preferences',
  table: '/table',
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
    href: routes.table,
    label: 'table',
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
      {
        href: routes.preferences,
        label: 'preferences',
        icon: 'Settings',
      },
    ],
  },
];
