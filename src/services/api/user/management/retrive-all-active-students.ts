import { authFetch } from "@/services/auth-fetch"
import { UserStudentResponse } from "@/interface/UserStudent"
import { USER_MANAGEMENT_API_ENDPOINTS } from "@/constants/api"

export const getActiveStudents = async (): Promise<UserStudentResponse[]> => {
     try {
          const res = await authFetch(USER_MANAGEMENT_API_ENDPOINTS.RETRIEVE_ACTIVE_STUDENTS)
          if (!res.ok) {
               let errorMsg = `Failed to fetch active students`
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
          console.error("Error fetching active students:", err)
          throw err
     }
}
