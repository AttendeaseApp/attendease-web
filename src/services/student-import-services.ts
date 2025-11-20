import { USER_MANAGEMENT_API_ENDPOINTS } from "@/constants/api"
import { authFetch } from "./auth-fetch"

export const uploadStudentCSV = async (file: File) => {
     const formData = new FormData()
     formData.append("file", file)

     try {
          const res = await authFetch(USER_MANAGEMENT_API_ENDPOINTS.IMPORT_STUDENT_ACCOUNTS, {
               method: "POST",
               body: formData,
          })

          if (!res.ok) {
               const text = await res.text()
               console.error("Upload failed response:", text)
               throw new Error(`Failed to upload CSV: ${text}`)
          }

          return res.json()
     } catch (error) {
          console.error("Error in uploadStudentCSV:", error)
          throw error
     }
}
