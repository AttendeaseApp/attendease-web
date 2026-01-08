import { authFetch } from "@/services/auth-fetch"
import { UserStudentResponse } from "@/interface/UserStudent"
import { USER_MANAGEMENT_API_ENDPOINTS } from "@/constants/api"

export const getInactiveStudents = async (): Promise<UserStudentResponse[]> => {
     try {
          const res = await authFetch(USER_MANAGEMENT_API_ENDPOINTS.RETRIEVE_INACTIVE_STUDENTS)
          if (!res.ok) {
               let errorMsg = `Failed to fetch inactive students`
               try {
                    const errorBody = await res.json()
                    errorMsg = errorBody.message || errorBody.error || JSON.stringify(errorBody)
               } catch {
                    errorMsg = res.statusText || errorMsg
               }
               throw new Error(errorMsg)
          }
          return (await res.json()) as UserStudentResponse[]
     } catch (err) {
          console.error("Error fetching inactive students:", err)
          throw err
     }
}
