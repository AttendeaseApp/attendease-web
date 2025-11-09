import { LoginResponse } from "@/interface/auth-interface";
import { LOGIN } from "@/constants/api";

/**
 * Logs in a user with the provided email and password.
 * On success, stores the auth token in local storage.
 *
 * @param email User's email address
 * @param password User's password
 * @returns An object indicating success or failure, along with relevant data.
 */
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await fetch(LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      await localStorage.setItem("authToken", data.token);
      return {
        success: true,
        email: data.email,
        token: data.token,
      };
    } else {
      return {
        success: false,
        message: data.message || "Invalid credentials",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please try again. " + String(error),
    };
  }
}
