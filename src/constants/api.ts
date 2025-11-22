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

/**
 * All cluster and course management related API endpoints.
 */
export const CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS = {
     GET_ALL_COURSES: `${API_BASE}/api/courses`,
     GET_ALL_CLUSTERS: `${API_BASE}/api/clusters`,
     DELETE_CLUSTER: (id: string) => `${API_BASE}/api/clusters/${id}`,
     CREATE_COURSE: (id: string) => `${API_BASE}/api/courses?clusterId=${id}`,
     DELETE_COURSE: (id: string) => `${API_BASE}/api/courses/${id}`,
     CREATE_CLUSTER: `${API_BASE}/api/clusters`,
}

/**
 * All location management related API endpoints.
 */
export const LOCATION_MANAGEMENT_API_ENDPOINTS = {
     GET_ALL_LOCATIONS: `${API_BASE}/api/locations`,
     CREATE_LOCATION: `${API_BASE}/api/locations`,
     DELETE_LOCATION: (id: string) => `${API_BASE}/api/locations/${id}`,
}

/**
 * All user management related API endpoints.
 */
export const USER_MANAGEMENT_API_ENDPOINTS = {
     RETRIEVE_ALL_USERS: `${API_BASE}/api/users/management`,
     IMPORT_STUDENT_ACCOUNTS: `${API_BASE}/api/users/management/import`,
     RETRIEVE_ALL_STUDENTS: `${API_BASE}/api/users/management/students`,
     ADD_OSA: `${API_BASE}/api/auth/osa/register`,
     ADD_STUDENT: `${API_BASE}/api/auth/student/register`,
}

export const EVENT_MONITORING_API_ENDPOINTS = {
     GET_ALL_EVENTS_FOR_MONITORING: `${API_BASE}/api/events/monitoring/all`,
     GET_REGISTERED_ATTENDEES: (id: string) =>
          `${API_BASE}/api/events/monitoring/attendees/registered/${id}`,
}

export const OSA_PROFILE_ENDPOINT = {
     GET_OSA_PROFILE: `${API_BASE}/api/profile/user-osa/me`,
     OSA_CHANGE_PASSWORD: `${API_BASE}/api/profile/account/password/update`,
}

export const ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS = {
     GET_FINALIZED_EVENT_SUMMARY: `${API_BASE}/api/attendance/records/event/finalized`,
     GET_ATTENDEES_BY_EVENT_ID: (id: string) =>
          `${API_BASE}/api/attendance/records/attendees/event/${id}`,
     GET_EVENT_BY_ID: (id: string) => `${API_BASE}/api/attendance/records/event/${id}`,
     GET_ATTENDANCE_RECORDS_BY_STUDENT_ID: (id: string) =>
          `${API_BASE}/api/attendance/records/student/${id}`,
     UPDATE_STUDENT_ATTENDANCE_STATUS_BY_STUDENT_AND_EVENT_ID: (
          studentId: string,
          eventId: string
     ) => `${API_BASE}/api/attendance/records/${studentId}/event/${eventId}`,
}
