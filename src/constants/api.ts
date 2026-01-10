export const API_BASE = "http://192.168.1.7:8082"
/**
 * constant login endpoint
 */
export const LOGIN = `${API_BASE}/api/osa/auth/login`

/**
 * All event management related API endpoints.
 */
export const EVENT_MANAGEMENT_API_ENDPOINTS = {
     CREATE_EVENT:                            `${API_BASE}/api/osa/event/management/create`,
     GET_EVENT_BY_ID: (id: string) =>         `${API_BASE}/api/osa/event/management/${id}`,
     GET_EVENT_BY_STATUS: (status: string) => `${API_BASE}/api/osa/event/management/status/${status}`,
     GET_ALL_EVENTS:                          `${API_BASE}/api/osa/event/management/all-events`,
     CANCEL_EVENT: (id: string) =>            `${API_BASE}/api/osa/event/management/${id}/cancel`,
     UPDATE_EVENT: (id: string) =>            `${API_BASE}/api/osa/event/management/${id}/update`,
     DELETE_EVENT: (id: string) =>            `${API_BASE}/api/osa/event/management/${id}/delete`,
}

/**
 * All cluster and course management related API endpoints.
 */
export const SECTION_MANAGEMENT_ENDPOINTS = {
     CREATE_SECTION: (id: string) => `${API_BASE}/api/osa/section/management/courses/${id}`,
     CREATE_SECTIONS_BULK: (courseId: string) =>
          `${API_BASE}/api/osa/section/management/bulk?courseId=${courseId}`,
     GET_ALL_SECTIONS: `${API_BASE}/api/osa/section/management`,
     GET_SECTIONS_BY_COURSE: (courseId: string) =>
          `${API_BASE}/api/osa/section/management/courses/${courseId}`,
     UPDATE_SECTION: (id: string) => `${API_BASE}/api/osa/section/management/${id}`,
     DELETE_SECTION: (id: string) => `${API_BASE}/api/osa/section/management/${id}`,
}

export const ACADEMIC_YEAR_MANAGEMENT_ENDPOINTS = {
     TRIGGER_ACADEMIC_SCHEDULER:                `${API_BASE}/api/osa/academic-year/scheduler/trigger-academic-year-activation`,
     GET_ACTIVE_ACADEMIC_YEAR:                  `${API_BASE}/api/osa/academic-year/management/active`,
     CREATE_ACADEMIC_YEAR:                      `${API_BASE}/api/osa/academic-year/management`,
     GET_ALL_ACADEMIC_YEARS:                    `${API_BASE}/api/osa/academic-year/management`,
     ACTIVATE_ACADEMIC_YEAR: (id: string) =>    `${API_BASE}/api/osa/academic-year/management/${id}/activate`,
     DELETE_ACADEMIC_YEAR: (id: string) =>      `${API_BASE}/api/osa/academic-year/management/${id}`,
     GET_ACADEMIC_YEAR_BY_ID: (id: string) =>   `${API_BASE}/api/osa/academic-year/management/${id}`,
     UPDATE_ACADEMIC_YEAR: (id: string) =>      `${API_BASE}/api/osa/academic-year/management/${id}`,
     DEACTIVATE_ACADEMIC_YEAR: (id: string) =>  `${API_BASE}/api/osa/academic-year/management/${id}/deactivate`,
     GET_CURRENT_SEMESTER:                      `${API_BASE}/api/osa/academic-year/management/current-semester`,
     GET_CURRENT_SEMESTER_NAME:                 `${API_BASE}/api/osa/academic-year/management/current-semester-name`,
     GET_SEMESTER_STATUS: `                      ${API_BASE}/api/osa/academic-year/management/semester-status`,
}

export const CLUSTER_MANAGEMENT_SERVICE_ENDPOINTS = {
     CREATE_CLUSTER:                 `${API_BASE}/api/osa/cluster/management`,
     GET_ALL_CLUSTERS:               `${API_BASE}/api/osa/cluster/management`,
     UPDATE_CLUSTER: (id: string) => `${API_BASE}/api/osa/cluster/management/${id}`,
     DELETE_CLUSTER: (id: string) => `${API_BASE}/api/osa/cluster/management/${id}`,
}

export const COURSE_MANAGEMENT_SERVICE_ENDPOINTS = {
     CREATE_COURSE: (id: string) => `${API_BASE}/api/osa/course/management?clusterId=${id}`,
     GET_ALL_COURSES:               `${API_BASE}/api/osa/course/management`,
     UPDATE_COURSE: (id: string) => `${API_BASE}/api/osa/course/management/${id}`,
     DELETE_COURSE: (id: string) => `${API_BASE}/api/osa/course/management/${id}`,
}

/**
 * All location management related API endpoints.
 */
export const LOCATION_MANAGEMENT_API_ENDPOINTS = {
     CREATE_LOCATION:                 `${API_BASE}/api/osa/location/management/create`,
     GET_ALL_LOCATIONS:               `${API_BASE}/api/osa/location/management/all`,
     UPDATE_LOCATION: (id: string) => `${API_BASE}/api/osa/location/management/${id}/update`,
     DELETE_LOCATION: (id: string) => `${API_BASE}/api/osa/location/management/${id}/delete`,
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

     ADD_OSA_ACCOUNT: `${API_BASE}/api/osa/account/register`,
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
     GET_ALL_ATTENDANCE_RECORDS:                             `${API_BASE}/api/osa/attendance-records/management/all`,
     GET_FINALIZED_EVENT_SUMMARY:                            `${API_BASE}/api/osa/attendance-records/management/finalized/summary`,
     GET_ATTENDEES_BY_EVENT_ID: (id: string) =>              `${API_BASE}/api/osa/attendance-records/management/event/${id}/attendees`,
     GET_ATTENDANCE_RECORDS_BY_STUDENT_ID: (id: string) =>   `${API_BASE}/api/osa/attendance-records/management/student/${id}/records`,
     UPDATE_STUDENT_ATTENDANCE_STATUS_BY_STUDENT_AND_EVENT_ID:
        (studentId: string,eventId: string) =>               `${API_BASE}/api/osa/attendance-records/management/${studentId}/event/${eventId}/update-status`,
     DELETE_ATTENDANCE_RECORD_BY_ID: (id: string) =>         `${API_BASE}/api/osa/attendance-records/management/${id}/delete`,
     DELETE_ALL_ATTENDANCE_RECORDS:                          `${API_BASE}/api/osa/attendance-records/management/delete/all`,
}
