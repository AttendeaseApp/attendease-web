import { authFetch } from "./auth-fetch";
import { OSA_PROFILE_ENDPOINT, USER_MANAGEMENT_API_ENDPOINTS } from "../constants/api";
import { UserStudentResponse } from "@/interface/user-interface";
import { API_BASE } from "../constants/api";

/**
 * Retrieve all users
 *
 * @returns list of users
 */
export const getAllUsers = async (): Promise<[UserStudentResponse]> => {
  try {
    const res = await authFetch(USER_MANAGEMENT_API_ENDPOINTS.RETRIEVE_ALL_USERS);
    if (!res.ok) {
      throw new Error(`Failed to fetch events: ${res.status}`);
    }
    const data = await res.json();
    return data as [UserStudentResponse];
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

/**
 * Get OSA profile
 */
export const getOSAProfile = async (): Promise<UserStudentResponse> => {
  try {
    const res = await authFetch(OSA_PROFILE_ENDPOINT.GET_OSA_PROFILE);
    if (!res.ok) {
      throw new Error(`Failed to fetch Profile Data: ${res.status}`);
    }
    const data = await res.json();
    return data as UserStudentResponse;
  } catch (error) {
    console.error("Error fetching Profile Data", error);
    throw error;
  }
};

/**
 * Create a new OSA account
 */
export async function createOSAAccount(payload: any) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  const res = await fetch(`${API_BASE}/api/auth/osa/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create OSA account");
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  } else {
    return await res.text();
  }
}
