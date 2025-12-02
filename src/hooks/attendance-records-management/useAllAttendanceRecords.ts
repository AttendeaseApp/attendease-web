import { useState, useEffect } from "react"
import { AttendanceRecords } from "@/interface/attendance/records/AttendanceRecords"
import { ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS } from "../../constants/api"
import { authFetch } from "@/services/auth-fetch"

export function useAllAttendanceRecords(): {
     data: AttendanceRecords[]
     loading: boolean
     error: Error | null
     refetch: () => void
} {
     const [data, setData] = useState<AttendanceRecords[]>([])
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<Error | null>(null)

     const refetch = async () => {
          setLoading(true)
          setError(null)
          try {
               const url = ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS.GET_ALL_ATTENDANCE_RECORDS
               const response = await authFetch(url, { method: "GET" })
               if (!response.ok) {
                    throw new Error(
                         `Failed to fetch all records: ${response.status} ${response.statusText}`
                    )
               }
               const recordsData: AttendanceRecords[] = await response.json()
               setData(recordsData)
          } catch (err) {
               setError(err instanceof Error ? err : new Error("Unknown error"))
          } finally {
               setLoading(false)
          }
     }

     useEffect(() => {
          refetch()
     }, [])

     return { data, loading, error, refetch }
}
