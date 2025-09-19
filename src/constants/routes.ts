// Define routes and navigation structure

export const routes = {
  signIn: '/sign-in',
  dashboard: '/dashboard',
  admins: '/settings/admins',
  preferences: '/settings/preferences',
  sidebar: '/settings/sidebar',
  sidebarUpsert: '/settings/sidebar/create',
  forms: '/forms',
  success: '/success',
  groupCodes: '/settings/group-codes',
  groupCodesUpsert: '/settings/group-codes/create',
  codes: '/settings/codes',
  codesUpsert: '/settings/codes/create',
};

export interface SideNavItem {
  id: string;
  href: string;
  label: string;
  icon: string | null;
  children?: SideNavItem[];
}
