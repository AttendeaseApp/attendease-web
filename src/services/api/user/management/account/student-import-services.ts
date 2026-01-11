import { USER_MANAGEMENT_API_ENDPOINTS } from "@/constants/api"
import { authFetch } from "@/services/auth-fetch"



export interface importCSVDetail {
    row: number
    errors: string[]
}

export interface importCSVSummary {
    totalRows: number
    successfulRows: number
    failedRows: number
    missingSections: string[]
    duplicateStudentNumbers: string[]
    errorTypes: Record<string, number>
}

export interface importCSVResult {
    errorCode?: string
    message?: string
    summary: importCSVSummary
    details: importCSVDetail[]
    timestamp?: string
}

export const uploadStudentCSV = async (file: File) => {
     const formData = new FormData()
     formData.append("file", file)

     try {
          const res = await authFetch(USER_MANAGEMENT_API_ENDPOINTS.IMPORT_STUDENT_ACCOUNTS, {
               method: "POST",
               body: formData,
          })

const text = await res.text() 

           try {
            const jsonResult: importCSVResult = JSON.parse(text)
            return jsonResult
        } catch (parseError) {
     
            throw new Error(`Invalid CSV upload response`)
        }
        
     } catch (error) {
          console.error("Error in uploadStudentCSV:", error)
          throw error
     }
}
