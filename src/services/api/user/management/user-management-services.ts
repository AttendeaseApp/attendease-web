import { authFetch } from "../../../auth-fetch"
import {
     API_BASE,
     OSA_PROFILE_ENDPOINT,
     USER_MANAGEMENT_API_ENDPOINTS,
} from "../../../../constants/api"
import { UserStudentResponse } from "@/interface/UserStudent"
import { Section } from "@/interface/academic/section/SectionInterface"
import { OsaRegistrationInterface } from "@/interface/management/registration/OsaRegistrationInterface"
import { StudentRegistrationInterface } from "@/interface/management/registration/StudentRegistrationInterface"

/**
 * Retrieve all users
 *
 * @returns list of users
 */
export const getAllUsers = async (): Promise<UserStudentResponse[]> => {
     try {
          const res = await authFetch(USER_MANAGEMENT_API_ENDPOINTS.RETRIEVE_ALL_USERS)
          if (!res.ok) {
               let errorMsg = `Failed to fetch users: ${res.status}`
               try {
                    const errorBody = await res.json()
                    errorMsg =
                         errorBody.message ||
                         errorBody.error ||
                         (Array.isArray(errorBody.errors)
                              ? errorBody.errors[0]?.defaultMessage
                              : JSON.stringify(errorBody))
               } catch {
                    errorMsg = res.statusText || errorMsg
               }
               throw new Error(errorMsg)
          }
          const data = await res.json()
          return data as UserStudentResponse[]
     } catch (error) {
          console.error("Error fetching users:", error)
          throw error
     }
}

/**
 * Get OSA profile
 */
export const getOSAProfile = async (): Promise<UserStudentResponse> => {
     try {
          const res = await authFetch(OSA_PROFILE_ENDPOINT.GET_OSA_PROFILE)
          if (!res.ok) {
               let errorMsg = `Failed to fetch profile: ${res.status}`
               try {
                    const errorBody = await res.json()
                    errorMsg =
                         errorBody.message ||
                         errorBody.error ||
                         (Array.isArray(errorBody.errors)
                              ? errorBody.errors[0]?.defaultMessage
                              : JSON.stringify(errorBody))
               } catch {
                    errorMsg = res.statusText || errorMsg
               }
               throw new Error(errorMsg)
          }
          const data = await res.json()
          return data as UserStudentResponse
     } catch (error) {
          console.error("Error fetching OSA profile:", error)
          throw error
     }
}

/**
 * Create a new OSA account
 */
export const createOSAAccount = async (payload: OsaRegistrationInterface) => {
     try {
          const res = await authFetch(USER_MANAGEMENT_API_ENDPOINTS.ADD_OSA_ACCOUNT, {
               method: "POST",
               body: JSON.stringify(payload),
          })

          if (!res.ok) {
               let errorMsg = "Failed to create OSA account"
               try {
                    const errorBody = await res.json()
                    errorMsg =
                         errorBody.message ||
                         errorBody.error ||
                         (Array.isArray(errorBody.errors)
                              ? errorBody.errors[0]?.defaultMessage
                              : JSON.stringify(errorBody))
               } catch {
                    const text = await res.text()
                    errorMsg = text || errorMsg
               }
               throw new Error(errorMsg)
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
export const createStudentAccount = async (payload: StudentRegistrationInterface) => {
     try {
          const res = await authFetch(USER_MANAGEMENT_API_ENDPOINTS.ADD_STUDENT_ACCOUNT, {
               method: "POST",
               body: JSON.stringify(payload),
          })

          if (!res.ok) {
               let errorMsg = "Failed to create student account"
               try {
                    const errorBody = await res.json()
                    errorMsg =
                         errorBody.message ||
                         errorBody.error ||
                         (Array.isArray(errorBody.errors)
                              ? errorBody.errors[0]?.defaultMessage
                              : JSON.stringify(errorBody))
               } catch {
                    const text = await res.text()
                    errorMsg = text || errorMsg
               }
               throw new Error(errorMsg)
          }

          const contentType = res.headers.get("content-type")
          return contentType && contentType.includes("application/json")
               ? await res.json()
               : await res.text()
     } catch (err) {
          console.error("Error creating student account:", err)
          throw err
     }
}

/**
 * Fetch all sections
 */
export const getSections = async (): Promise<Section[]> => {
     try {
          const res = await authFetch(`${API_BASE}/api/sections`)
          if (!res.ok) {
               let errorMsg = `Failed to fetch sections: ${res.status}`
               try {
                    const errorBody = await res.json()
                    errorMsg =
                         errorBody.message ||
                         errorBody.error ||
                         (Array.isArray(errorBody.errors)
                              ? errorBody.errors[0]?.defaultMessage
                              : JSON.stringify(errorBody))
               } catch {
                    errorMsg = res.statusText || errorMsg
               }
               throw new Error(errorMsg)
          }
          const data = await res.json()
          return data as Section[]
     } catch (err) {
          console.error("Error fetching sections:", err)
          return []
     }
}

/**
 * Delete students by section
 */
export const deleteStudentAccountBySection = async (section: string) => {
     try {
          const res = await authFetch(
               `${API_BASE}/api/users/management/section/${encodeURIComponent(section)}`,
               {
                    method: "DELETE",
               }
          )

          if (!res.ok) {
               let errorMsg = `Failed to delete users for section: ${section}`
               try {
                    const errorBody = await res.json()
                    errorMsg =
                         errorBody.message ||
                         errorBody.error ||
                         (Array.isArray(errorBody.errors)
                              ? errorBody.errors[0]?.defaultMessage
                              : JSON.stringify(errorBody))
               } catch {
                    const text = await res.text()
                    errorMsg = text || errorMsg
               }
               throw new Error(errorMsg)
          }

          const contentType = res.headers.get("content-type")
          return contentType && contentType.includes("application/json")
               ? await res.json()
               : await res.text()
     } catch (err) {
          console.error(`Error deleting users for section ${section}:`, err)
          throw err
     }
}

/**
 * Delete ALL students and associated biometrics data
 */
export const deleteAllStudentsAndBiometrics = async (): Promise<string> => {
     try {
          const res = await authFetch(
               USER_MANAGEMENT_API_ENDPOINTS.DELETE_ALL_STUDENTS_AND_ASSOCIATED_BIOMETRICS,
               {
                    method: "DELETE",
               }
          )

          if (!res.ok) {
               let errorMsg = `Failed to delete all students and biometrics`
               try {
                    const errorBody = await res.json()
                    errorMsg =
                         errorBody.message ||
                         errorBody.error ||
                         (Array.isArray(errorBody.errors)
                              ? errorBody.errors[0]?.defaultMessage
                              : JSON.stringify(errorBody, null, 2))
               } catch {
                    const text = await res.text()
                    errorMsg = text || errorMsg
               }
               throw new Error(errorMsg)
          }

          const contentType = res.headers.get("content-type")
          const data =
               contentType && contentType.includes("application/json")
                    ? await res.json()
                    : await res.text()

          return typeof data === "object" ? JSON.stringify(data, null, 2) : data
     } catch (err) {
          console.error("Error deleting all students and biometrics:", err)
          throw err
     }
}
