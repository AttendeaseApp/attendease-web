import { useState, useEffect } from "react"
import { AttendanceRecords } from "@/interface/attendance/records/AttendanceRecords"
import { authFetch } from "@/services/auth-fetch"

export function useAttendanceRecordById(recordId: string): {
     data: AttendanceRecords | null
     loading: boolean
     error: Error | null
     refetch: () => void
} {
     const [data, setData] = useState<AttendanceRecords | null>(null)
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<Error | null>(null)

     const refetch = async () => {
          if (!recordId) return
          setLoading(true)
          setError(null)
          try {
               const response = await authFetch(`/api/attendance/records/${recordId}`, {
                    method: "GET",
               })
               if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`)
               const recordData = await response.json()
               setData(recordData)
          } catch (err) {
               setError(err instanceof Error ? err : new Error("Unknown error"))
          } finally {
               setLoading(false)
          }
     }

     useEffect(() => {
          refetch()
     }, [recordId])

     return { data, loading, error, refetch }
}
