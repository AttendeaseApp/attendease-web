import { useState } from "react"
import { authFetch } from "@/services/auth-fetch"
import { ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS } from "@/constants/api"

export function useDeleteAllAttendanceRecords(refetch?: () => void): {
     deleteAll: () => Promise<void>
     pending: boolean
     error: Error | null
} {
     const [pending, setPending] = useState(false)
     const [error, setError] = useState<Error | null>(null)

     const deleteAll = async (): Promise<void> => {
          setPending(true)
          setError(null)
          try {
               const response = await authFetch(
                    ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS.DELETE_ALL_ATTENDANCE_RECORDS,
                    {
                         method: "DELETE",
                    }
               )
               if (!response.ok) {
                    throw new Error(
                         `Failed to delete all records: ${response.status} ${response.statusText}`
                    )
               }
               refetch?.()
          } catch (err) {
               setError(err instanceof Error ? err : new Error("Unknown error"))
          } finally {
               setPending(false)
          }
     }

     return { deleteAll, pending, error }
}
