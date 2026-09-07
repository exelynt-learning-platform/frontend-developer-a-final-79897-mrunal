export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful!',
    LOGOUT: 'Logout successful!',
    EMPLOYEE_CREATED: 'Employee created successfully!',
    EMPLOYEE_UPDATED: 'Employee updated successfully!',
    EMPLOYEE_DELETED: 'Employee deleted successfully!',
    DEPARTMENT_CREATED: 'Department created successfully!',
    DEPARTMENT_UPDATED: 'Department updated successfully!',
    DEPARTMENT_DELETED: 'Department deleted successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
    PASSWORD_CHANGED: 'Password changed successfully!',
  },
  ERROR: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    SESSION_EXPIRED: 'Your session has expired. Please login again.',
    UNAUTHORIZED: 'You are not authorized to access this resource.',
    FORBIDDEN: 'Access forbidden.',
    NOT_FOUND: 'Resource not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    VALIDATION_ERROR: 'Please check your input.',
  },
  WARNING: {
    DELETE_CONFIRMATION: 'Are you sure you want to delete this?',
    UNSAVED_CHANGES: 'You have unsaved changes. Do you want to leave?',
  },
  INFO: {
    LOADING: 'Loading...',
    NO_DATA: 'No data available.',
    PROCESSING: 'Processing your request...',
  },
};
