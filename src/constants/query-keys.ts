export const QueryKeys = {
  admins: {
    all: ['admins'],
    details: ['admins', 'details'],
  },

  settings: {
    sidebar: {
      all: ['settings', 'sidebar'],
      details: ['settings', 'sidebar', 'details'],
    },
  },
} as const;
