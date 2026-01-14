import { useCallback, useEffect, useState } from "react"
import { ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS } from "@/constants/api"
import { authFetch } from "@/services/auth-fetch"
import { AttendanceSortCriteria } from "@/interface/enums/attendance/AttendanceSortCriteria"
import { SortedAttendanceRecordsResponse } from "@/interface/attendance/records/management/SortedAttendanceRecordsResponse"

export function useSortedEventAttendees(eventId: string, sortBy: AttendanceSortCriteria) {
     const [data, setData] = useState<SortedAttendanceRecordsResponse | null>(null)
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<Error | null>(null)

     const fetchSorted = useCallback(async () => {
          if (!eventId) return

          setLoading(true)
          setError(null)

          try {
               const url =
                    ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS.GET_SORTED_ATTENDANCE_RECORDS(eventId) +
                    `?sortBy=${sortBy}`

               const response = await authFetch(url, { method: "GET" })

               if (!response.ok) {
                    throw new Error(`Failed to fetch sorted attendees`)
               }

               const json: SortedAttendanceRecordsResponse = await response.json()
               setData(json)
          } catch (err) {
               setError(err instanceof Error ? err : new Error("Unknown error"))
          } finally {
               setLoading(false)
          }
     }, [eventId, sortBy])

     useEffect(() => {
          fetchSorted()
     }, [fetchSorted])

     return { data, loading, error, refetch: fetchSorted }
}
