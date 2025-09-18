export const QueryKeys = {
  admins: {
    all: ['admins'],
    details: ['admins', 'details'],
  },

  settings: {
    sidebar: {
      all: ['settings', 'sidebar'],
      table: ['settings', 'sidebar', 'table'],
      details: ['settings', 'sidebar', 'details'],
    },
  },
} as const;
