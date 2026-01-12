import { USER_MANAGEMENT_API_ENDPOINTS } from "@/constants/api"
import { authFetch } from "@/services/auth-fetch"
import { importCSVResult } from "@/interface/import-stud-interface"

export const uploadStudentCSV = async (file: File) => {
     const formData = new FormData()
     formData.append("file", file)

     try {
          const res = await authFetch(USER_MANAGEMENT_API_ENDPOINTS.IMPORT_STUDENT_ACCOUNTS, {
               method: "POST",
               body: formData,
          })

          const text = await res.text()
          let data: importCSVResult

          try {
               data = JSON.parse(text)
          } catch {
               throw new Error("Invalid JSON response from server")
          }

          if (
               data.errorCode ||
               (data.summary.failedRows > 0 && data.summary.successfulRows === 0)
          ) {
               throw data
          }

          return data
     } catch (error) {
          console.error("Error in uploadStudentCSV:", error)
          throw error
     }
}
