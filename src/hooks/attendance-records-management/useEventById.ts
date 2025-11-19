import { useState, useEffect } from "react"
import { EventSession } from "@/interface/event-interface"
import { ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS } from "../../constants/api"
import { authFetch } from "@/services/auth-fetch"

export function useEventById(eventId: string): {
     data: EventSession | null
     loading: boolean
     error: Error | null
} {
     const [data, setData] = useState<EventSession | null>(null)
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<Error | null>(null)

     useEffect(() => {
          if (!eventId) return

          const fetchEvent = async () => {
               try {
                    const url = ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS.GET_EVENT_BY_ID(eventId)
                    const response = await authFetch(url, { method: "GET" })

                    if (!response.ok) {
                         throw new Error(`Failed to fetch event: ${response.status}`)
                    }

                    const eventData: EventSession = await response.json()
                    setData(eventData)
               } catch (err) {
                    setError(err instanceof Error ? err : new Error("Unknown error"))
               } finally {
                    setLoading(false)
               }
          }

          fetchEvent()
     }, [eventId])

     return { data, loading, error }
}
