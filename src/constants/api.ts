export const API_BASE = "http://rcattendease.online"
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
     TRIGGER_ACADEMIC_SCHEDULER: `${API_BASE}/api/scheduler/trigger-academic-year-activation`,
     GET_ACTIVE_ACADEMIC_YEAR: `${API_BASE}/api/academic-years/active`,
     CREATE_ACADEMIC_YEAR: `${API_BASE}/api/academic-years`,
     GET_ALL_ACADEMIC_YEARS: `${API_BASE}/api/academic-years`,
     ACTIVATE_ACADEMIC_YEAR: (id: string) => `${API_BASE}/api/academic-years/${id}/activate`,
     DELETE_ACADEMIC_YEAR: (id: string) => `${API_BASE}/api/academic-years/${id}`,
     GET_ACADEMIC_YEAR_BY_ID: (id: string) => `${API_BASE}/api/academic-years/${id}`,
     UPDATE_ACADEMIC_YEAR: (id: string) => `${API_BASE}/api/academic-years/${id}`,
     DEACTIVATE_ACADEMIC_YEAR: (id: string) => `${API_BASE}/api/academic-years/${id}/deactivate`,
     GET_CURRENT_SEMESTER: `${API_BASE}/api/academic-years/current-semester`,
     GET_CURRENT_SEMESTER_NAME: `${API_BASE}/api/academic-years/current-semester-name`,
     GET_SEMESTER_STATUS: `${API_BASE}/api/academic-years/semester-status`,
     GET_ALL_COURSES: `${API_BASE}/api/courses`,
     GET_ALL_CLUSTERS: `${API_BASE}/api/clusters`,
     DELETE_CLUSTER: (id: string) => `${API_BASE}/api/clusters/${id}`,
     CREATE_COURSE: (id: string) => `${API_BASE}/api/courses?clusterId=${id}`,
     DELETE_COURSE: (id: string) => `${API_BASE}/api/courses/${id}`,
     CREATE_CLUSTER: `${API_BASE}/api/clusters`,
     GET_ALL_SECTIONS: `${API_BASE}/api/sections`,
     CREATE_SECTION: (id: string) => `${API_BASE}/api/sections/courses/${id}`,
     DELETE_SECTION: (id: string) => `${API_BASE}/api/sections/${id}`,
     GET_SECTIONS_BY_COURSE: (courseId: string) => `${API_BASE}/api/sections/courses/${courseId}`,
     UPDATE_CLUSTER: (id: string) => `${API_BASE}/api/clusters/${id}`,
     CREATE_SECTIONS_BULK: (courseId: string) =>
          `${API_BASE}/api/sections/bulk?courseId=${courseId}`,
     UPDATE_COURSE: (id: string) => `${API_BASE}/api/courses/${id}`,
     UPDATE_SECTION: (id: string) => `${API_BASE}/api/sections/${id}`,
}

/**
 * All location management related API endpoints.
 */
export const LOCATION_MANAGEMENT_API_ENDPOINTS = {
     GET_ALL_LOCATIONS: `${API_BASE}/api/locations`,
     CREATE_LOCATION: `${API_BASE}/api/locations`,
     DELETE_LOCATION: (id: string) => `${API_BASE}/api/locations/${id}`,
     UPDATE_LOCATION: (id: string) => `${API_BASE}/api/locations/${id}`,
}

/**
 * All user management related API endpoints.
 */
export const USER_MANAGEMENT_API_ENDPOINTS = {
     RETRIEVE_ALL_USERS: `${API_BASE}/api/user/management`,
     IMPORT_STUDENT_ACCOUNTS: `${API_BASE}/api/user/management/import`,
     RETRIEVE_ALL_STUDENTS: `${API_BASE}/api/user/management/students`,
     RETRIEVE_ACTIVE_STUDENTS: `${API_BASE}/api/user/management/students/active`,
     RETRIEVE_INACTIVE_STUDENTS: `${API_BASE}/api/user/management/students/inactive`,

     EDIT_USER_DETAILS: (userId: string) => `${API_BASE}/api/user/information/management/${userId}`,

     ADD_OSA_ACCOUNT: `${API_BASE}/api/auth/osa/register`,
     ADD_STUDENT_ACCOUNT: `${API_BASE}/api/auth/student/register`,
     DELETE_ALL_STUDENTS_AND_ASSOCIATED_BIOMETRICS: `${API_BASE}/api/user/information/management/students/remove-all`,
     BULK_ACTIVATE_STUDENTS: `${API_BASE}/api/user/management/students/activate`,
     BULK_DEACTIVATE_STUDENTS: `${API_BASE}/api/user/management/students/deactivate`,
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
     GET_ALL_ATTENDANCE_RECORDS: `${API_BASE}/api/attendance/records`,
     DELETE_ATTENDANCE_RECORD_BY_ID: (id: string) => `${API_BASE}/api/attendance/records/${id}`,
     DELETE_ALL_ATTENDANCE_RECORDS: `${API_BASE}/api/attendance/records`,
}
