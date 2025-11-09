export const API_BASE = "https://attendease-backend-latest.onrender.com"

/**
 * constant login endpoint
 */
export const LOGIN = `${API_BASE}/api/auth/osa/login`

export const EVENT_MANAGEMENT_API_ENDPOINTS = {
  GET_ALL_EVENTS: `${API_BASE}/api/events`,
  UPDATE_EVENT: (id: string) => `${API_BASE}/api/events/${id}`,
  CANCEL_EVENT: (id: string) => `${API_BASE}/api/events/${id}/cancel`,
  DELETE_EVENT: (id: string) => `${API_BASE}/api/events/${id}`,
}
