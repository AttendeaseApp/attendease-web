export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://attendease-backend-latest.onrender.com";

/**
 * constant login endpoint
 */
export const LOGIN = `${API_BASE}/api/auth/osa/login`

export const RETRIEVE_ALL_USERS = `${API_BASE}/api/users/management`
