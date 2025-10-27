export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "https://attendease-backend-latest.onrender.com";

/**
 * Helper function for making fetch requests.
 * - Automatically adds JSON headers
 * - Adds Authorization token if available
 * - Handles both JSON and plain text responses
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  /** gets token from local storage */ 
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /** send the request to backend */
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      /** include the token in headers if user is logged in */
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  /** throw message if backend returns an error */
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed with status ${res.status}`);
  }


  /** handle both JWT token and plain text */
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    // @ts-ignore
    return text;
  }
}
