import { FinalizedAttendanceRecordsResponse } from "@/interface/attendance/records/management/FinalizedAttendanceRecordsResponse"
import { fetchFinalizedEventSummary } from "@/services/api/attendance/records/management/getFinalizedEventSummary"
import { useState, useEffect } from "react"

export function useFinalizedEvents(): {
     data: FinalizedAttendanceRecordsResponse[] | null
     loading: boolean
     error: Error | null
     refetch: () => void
} {
     const [data, setData] = useState<FinalizedAttendanceRecordsResponse[] | null>(null)
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<Error | null>(null)

     const refetch = async () => {
          setLoading(true)
          setError(null)
          try {
               const events = await fetchFinalizedEventSummary()
               setData(events)
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
