import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_BASE } from "@/constants/api";

/** Utility for merging Tailwind CSS class names */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Helper function for making fetch requests */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  /** Get token from local storage */
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /** Build headers (force type to Record<string, string> to avoid TS errors) */
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  /** Skip adding token for public endpoints (login/register) */
  if (
    token &&
    !endpoint.includes("/auth/login") &&
    !endpoint.includes("/auth/register")
  ) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  /** Send request to backend */
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  /** Throw message if backend returns an error */
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  /** Handle both JSON and plain text responses */
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    // @ts-ignore
    return text;
  }
}
