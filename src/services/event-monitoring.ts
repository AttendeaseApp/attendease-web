import { EventSession } from "@/interface/event-interface"
import { EventAttendeesResponse } from "@/interface/event-monitoring-interface"
import { authFetch } from "./auth-fetch"
import { EVENT_MONITORING_API_ENDPOINTS } from "@/constants/api"

export const getAllEventsForMonitoring = async (): Promise<EventSession[]> => {
  const res = await authFetch(EVENT_MONITORING_API_ENDPOINTS.GET_ALL_EVENTS_FOR_MONITORING, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  if (!res.ok) throw new Error("Failed to fetch events")
  return res.json()
}

export const getRegisteredAttendees = async (eventId: string): Promise<EventAttendeesResponse> => {
  const res = await authFetch(EVENT_MONITORING_API_ENDPOINTS.GET_REGISTERED_ATTENDEES(eventId), {
    headers: {
      "Content-Type": "application/json",
    },
  })
  if (!res.ok) throw new Error("Failed to fetch attendees")
  return res.json()
}
