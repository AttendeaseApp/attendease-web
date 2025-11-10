export const API_BASE = "https://attendease-backend-latest.onrender.com"

/**
 * constant login endpoint
 */
export const LOGIN = `${API_BASE}/api/auth/osa/login`

/**
 * All event management related API endpoints.
 */
export const EVENT_MANAGEMENT_API_ENDPOINTS = {
  GET_ALL_EVENTS: `${API_BASE}/api/events`,
  CREATE_EVENT: `${API_BASE}/api/events`,
  UPDATE_EVENT: (id: string) => `${API_BASE}/api/events/${id}`,
  CANCEL_EVENT: (id: string) => `${API_BASE}/api/events/${id}/cancel`,
  DELETE_EVENT: (id: string) => `${API_BASE}/api/events/${id}`,
}

export const CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS = {
  GET_ALL_COURSES: `${API_BASE}/api/courses`,
  GET_ALL_CLUSTERS: `${API_BASE}/api/clusters`,
  CREATE_COURSE: (id: string) => `${API_BASE}/api/courses?clusterId=${id}`,
  DELETE_COURSE: (id: string) => `${API_BASE}/api/courses/${id}`,
  CREATE_CLUSTER: `${API_BASE}/api/clusters`
}
export const LOCATION_MANAGEMENT_API_ENDPOINTS = {
  GET_ALL_LOCATIONS: `${API_BASE}/api/locations`,
  CREATE_LOCATION: `${API_BASE}/api/locations`,
  DELETE_LOCATION: (id: string) => `${API_BASE}/api/locations/${id}`,
}

export const USER_MANAGEMENT_API_ENDPOINTS = {
  RETRIEVE_ALL_USERS: `${API_BASE}/api/users/management`,
  IMPORT_STUDENT_ACCOUNTS: `${API_BASE}/api/users/management/import`,
  RETRIEVE_ALL_STUDENTS: `${API_BASE}/api/users/management/students`,
}
