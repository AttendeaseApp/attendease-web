import { useState, useEffect } from "react"
import { EventAttendeesResponse } from "@/interface/attendance/records/management/AttendeesResponse"
import { ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS } from "../../constants/api"
import { authFetch } from "@/services/auth-fetch"

export function useEventAttendees(eventId: string): {
     data: EventAttendeesResponse | null
     loading: boolean
     error: Error | null
     refetch: () => void
} {
     const [data, setData] = useState<EventAttendeesResponse | null>(null)
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<Error | null>(null)

     const refetch = async () => {
          if (!eventId) return
          setLoading(true)
          setError(null)
          try {
               const url = ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS.GET_ATTENDEES_BY_EVENT_ID(eventId)
               const response = await authFetch(url, { method: "GET" })

               if (!response.ok) {
                    throw new Error(
                         `Failed to fetch attendees: ${response.status} ${response.statusText}`
                    )
               }

               const attendeesData: EventAttendeesResponse = await response.json()
               setData(attendeesData)
          } catch (err) {
               setError(err instanceof Error ? err : new Error("Unknown error"))
          } finally {
               setLoading(false)
          }
     }

     useEffect(() => {
          refetch()
     }, [eventId])

     return { data, loading, error, refetch }
}
