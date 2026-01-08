import { authFetch } from "@/services/auth-fetch"
import { USER_MANAGEMENT_API_ENDPOINTS } from "@/constants/api"

/**
 * Bulk activate students
 */
export const bulkActivateStudents = async (userIds: string[]) => {
     const res = await authFetch(USER_MANAGEMENT_API_ENDPOINTS.BULK_ACTIVATE_STUDENTS, {
          method: "POST",
          body: JSON.stringify(userIds),
     })

     if (!res.ok) {
          let errorMsg = "Failed to activate students"
          try {
               const errorBody = await res.json()
               errorMsg = errorBody.message || errorBody.error || JSON.stringify(errorBody)
          } catch {
               errorMsg = res.statusText || errorMsg
          }
          throw new Error(errorMsg)
     }
}
