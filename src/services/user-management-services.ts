import { authFetch } from "./auth-fetch"
import { USER_MANAGEMENT_API_ENDPOINTS } from "../constants/api"
import { UserStudentResponse } from "@/interface/user-interface"

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
