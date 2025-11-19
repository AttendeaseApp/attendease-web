import { authFetch } from "./auth-fetch"
import { OSA_PROFILE_ENDPOINT, USER_MANAGEMENT_API_ENDPOINTS } from "../constants/api"
import { UserStudentResponse } from "@/interface/user-interface"

export const API_BASE = "https://attendease-backend-latest.onrender.com"

export interface OsaAccountPayload {
     firstName: string
     lastName: string
     email: string
     password: string
     contact?: string
     userType: "OSA"
}

/**
 * Retrieve all users
 *
 * @returns list of users
 */
export const getAllUsers = async (): Promise<[UserStudentResponse]> => {
     try {
          const res = await authFetch(USER_MANAGEMENT_API_ENDPOINTS.RETRIEVE_ALL_USERS)
          if (!res.ok) {
               throw new Error(`Failed to fetch events: ${res.status}`)
          }
          const data = await res.json()
          return data as [UserStudentResponse]
     } catch (error) {
          console.error("Error fetching events:", error)
          throw error
     }
}

export const getOSAProfile = async (): Promise<UserStudentResponse> => {
     try {
          const res = await authFetch(OSA_PROFILE_ENDPOINT.GET_OSA_PROFILE)
          if (!res.ok) {
               throw new Error(`Failed to fetch Profile Data: ${res.status}`)
          }
          const data = await res.json()
          return data as UserStudentResponse
     } catch (error) {
          console.error("Error fetching Profile Data", error)
          throw error
     }
}

/**
 * Create a new OSA account
 */
export async function createOSAAccount(payload: OsaAccountPayload) {
     const token = localStorage.getItem("authToken")
     if (!token) throw new Error("Authentication token missing")

     const res = await fetch(`${API_BASE}/api/auth/osa/register`, {
          method: "POST",
          headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
     })

     if (!res.ok) {
          const text = await res.text()
          throw new Error(text || "Failed to create OSA account")
     }

     const contentType = res.headers.get("content-type")
     return contentType && contentType.includes("application/json")
          ? await res.json()
          : await res.text()
}
