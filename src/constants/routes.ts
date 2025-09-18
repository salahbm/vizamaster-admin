// Define routes and navigation structure

export const routes = {
  home: '/',
  signIn: '/sign-in',
  dashboard: '/dashboard',
  users: '/users',
  documents: '/documents',
  profile: '/settings/profile',
  admins: '/settings/admins',
  preferences: '/settings/preferences',
  sidebar: '/settings/sidebar',
  sidebarUpsert: '/settings/sidebar/create',
  table: '/table',
  forms: '/forms',
  success: '/success',
};

export interface SideNavItem {
  id: string;
  href: string;
  label: string;
  icon: string | null;
  children?: SideNavItem[];
}
