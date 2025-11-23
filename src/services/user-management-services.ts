import { authFetch } from "./auth-fetch"
import { API_BASE, OSA_PROFILE_ENDPOINT, USER_MANAGEMENT_API_ENDPOINTS } from "../constants/api"
import { UserStudentResponse } from "@/interface/UserStudent"
import { OsaAccountPayload } from "@/interface/users/OSAInterface"

export interface StudentAccountPayload {
     firstName: string
     lastName: string
     studentNumber: string
     section: string
     yearLevel: string
     contactNumber: string
     email: string
     address: string
     password: string
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
     try {
          const res = await authFetch(USER_MANAGEMENT_API_ENDPOINTS.ADD_OSA_ACCOUNT, {
               method: "POST",
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
     } catch (err) {
          console.error("Error creating OSA account:", err)
          throw err
     }
}

/**
 * Create a new Student account
 */
export const createStudentAccount = async (payload: StudentAccountPayload) => {
     try {
          const res = await authFetch(USER_MANAGEMENT_API_ENDPOINTS.ADD_STUDENT_ACCOUNT, {
               method: "POST",
               body: JSON.stringify(payload),
          })

          if (!res.ok) {
               const errorText = await res.text()
               throw new Error(errorText || "Failed to create student account")
          }

          const contentType = res.headers.get("content-type")
          return contentType && contentType.includes("application/json")
               ? await res.json()
               : await res.text()
     } catch (err) {
          console.error("Error creating student:", err)
          throw err
     }
}
