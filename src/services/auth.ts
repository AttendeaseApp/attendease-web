import { apiFetch } from "@/lib/utils";

/** Defines the possible structure of the login response */
interface LoginResponse {
  token?: string;
  user?: {
    name?: string;
    [key: string]: any;
  };
  success?: boolean;
  message?: string;
}

/** Login function (POST /auth/login) */
export async function login(
  email: string,
  password: string
): Promise<LoginResponse | string> {
  return apiFetch<LoginResponse | string>("/api/auth/osa/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
