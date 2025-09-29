export const QueryKeys = {
  admin: {
    profile: ['admin', 'profile'],
  },
  admins: {
    all: ['admins'],
    details: ['admins', 'details'],
  },
  applicants: {
    all: ['applicants'],
    details: ['applicants', 'details'],
    files: ['applicants', 'files'],
    visa: ['applicants', 'visa'],
    comments: ['applicants', 'comments'],
  },
  analytics: {
    all: ['analytics'],
  },
  alerts: {
    unread: ['alerts', 'unread'],
  },
  settings: {
    sidebar: {
      all: ['settings', 'sidebar'],
      table: ['settings', 'sidebar', 'table'],
      details: ['settings', 'sidebar', 'details'],
      options: ['settings', 'sidebar', 'options'],
    },
    groupCodes: {
      all: ['settings', 'groupCodes'],
      details: ['settings', 'groupCodes', 'details'],
    },
    codes: {
      all: ['settings', 'codes'],
      details: ['settings', 'codes', 'details'],
    },
  },
} as const;
