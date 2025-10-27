import { API_BASE } from "@/constants/api";

/** handles the connection for OSA login */
export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/osa/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text();
  try {
    /** try to parse if backend returns JSON */
    return JSON.parse(text);
  } catch {
    /** fallback if backend returns plain JWT token */
    return text;
  }
}
