import { useState } from "react"
import { authFetch } from "@/services/auth-fetch"
import { ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS } from "@/constants/api"
import { toast } from "sonner"

export function useDeleteAttendanceRecordsByAcademicYear(refetch?: () => void) {
     const [pending, setPending] = useState(false)
     const [error, setError] = useState<Error | null>(null)

     const deleteByAcademicYear = async (academicYearId: string) => {
          setPending(true)
          setError(null)
          try {
               const res = await authFetch(
                    ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS.DELETE_ATTENDANCE_RECORDS_BY_ACADEMIC_YEAR(
                         academicYearId
                    ),
                    { method: "DELETE" }
               )
               if (!res.ok)
                    throw new Error(`Failed to delete records for academic year: ${res.statusText}`)
               refetch?.()
               toast.success("Attendance records for the academic year deleted successfully")
          } catch (err) {
               const message = err instanceof Error ? err.message : "Unknown error"
               setError(new Error(message))
               toast.error("ERROR", {
                    description: message,
               })
          } finally {
               setPending(false)
          }
     }

     return { deleteByAcademicYear, pending, error }
}
