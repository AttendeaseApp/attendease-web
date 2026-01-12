import { useState, useEffect } from "react"
import { authFetch } from "@/services/auth-fetch"
import { ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS } from "@/constants/api"
import { toast } from "sonner"
import { FinalizedAttendanceRecordsResponse } from "@/interface/attendance/records/management/FinalizedAttendanceRecordsResponse"

export function useFinalizedEventsBySemester(academicYearId: string, semester: number) {
     const [data, setData] = useState<FinalizedAttendanceRecordsResponse[] | null>(null)
     const [loading, setLoading] = useState(false)
     const [error, setError] = useState<Error | null>(null)

     const fetchData = async () => {
          setLoading(true)
          setError(null)
          try {
               const res = await authFetch(
                    ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS.GET_FINALIZED_EVENTS_BY_SEMESTER(
                         academicYearId,
                         semester
                    )
               )
               if (!res.ok) throw new Error(`Failed to fetch finalized events: ${res.statusText}`)
               const result = await res.json()
               setData(result)
          } catch (err) {
               const message = err instanceof Error ? err.message : "Unknown error"
               setError(new Error(message))
               toast.error("ERROR", {
                    description: message,
               })
          } finally {
               setLoading(false)
          }
     }

     useEffect(() => {
          if (academicYearId && semester) fetchData()
     }, [academicYearId, semester])

     return { data, loading, error, refetch: fetchData }
}
