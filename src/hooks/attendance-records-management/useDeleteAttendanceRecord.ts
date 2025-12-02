import { useState } from "react"
import { authFetch } from "@/services/auth-fetch"
import { ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS } from "@/constants/api"

export function useDeleteAttendanceRecord(refetch?: () => void): {
     deleteRecord: (recordId: string) => Promise<void>
     pending: boolean
     error: Error | null
} {
     const [pending, setPending] = useState(false)
     const [error, setError] = useState<Error | null>(null)

     const deleteRecord = async (recordId: string): Promise<void> => {
          if (!recordId) return
          setPending(true)
          setError(null)
          try {
               const response = await authFetch(
                    ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS.DELETE_ATTENDANCE_RECORD_BY_ID(recordId),
                    {
                         method: "DELETE",
                    }
               )
               if (!response.ok) {
                    throw new Error(
                         `Failed to delete record: ${response.status} ${response.statusText}`
                    )
               }
               refetch?.()
          } catch (err) {
               setError(err instanceof Error ? err : new Error("Unknown error"))
          } finally {
               setPending(false)
          }
     }

     return { deleteRecord, pending, error }
}
