export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    VERIFY_TOKEN: '/auth/verify-token',
  },
  EMPLOYEES: {
    LIST: '/employees',
    GET: '/employees/:id',
    CREATE: '/employees',
    UPDATE: '/employees/:id',
    DELETE: '/employees/:id',
    SEARCH: '/employees/search',
  },
  DEPARTMENTS: {
    LIST: '/departments',
    GET: '/departments/:id',
    CREATE: '/departments',
    UPDATE: '/departments/:id',
    DELETE: '/departments/:id',
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    CHANGE_PASSWORD: '/profile/change-password',
    UPLOAD_AVATAR: '/profile/avatar',
  },
};

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
