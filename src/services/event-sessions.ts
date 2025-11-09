import { EventSession } from "@/interface/event-interface"
import { authFetch } from "./auth-fetch"
import { EVENT_MANAGEMENT_API_ENDPOINTS } from "@/constants/api"
import { format } from "date-fns"

/**
 * Get all events from the API.
 * @returns Promise<EventSession[]> Array of events
 */
export const getAllEvents = async (): Promise<EventSession[]> => {
  try {
    const res = await authFetch(EVENT_MANAGEMENT_API_ENDPOINTS.GET_ALL_EVENTS)
    if (!res.ok) {
      throw new Error(`Failed to fetch events: ${res.status}`)
    }
    const data = await res.json()
    return data as EventSession[]
  } catch (error) {
    console.error("Error fetching events:", error)
    throw error
  }
}

export const updateEvent = async (
  id: string,
  updatedData: Partial<EventSession>
): Promise<EventSession> => {
  try {
    const payload = { ...updatedData }
    if (payload.timeInRegistrationStartDateTime) {
      payload.timeInRegistrationStartDateTime = format(
        new Date(payload.timeInRegistrationStartDateTime),
        "yyyy-MM-dd HH:mm:ss"
      )
    }
    if (payload.startDateTime) {
      payload.startDateTime = format(new Date(payload.startDateTime), "yyyy-MM-dd HH:mm:ss")
    }
    if (payload.endDateTime) {
      payload.endDateTime = format(new Date(payload.endDateTime), "yyyy-MM-dd HH:mm:ss")
    }

    const res = await authFetch(EVENT_MANAGEMENT_API_ENDPOINTS.UPDATE_EVENT(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      throw new Error(`Failed to update event: ${res.status}`)
    }
    const data = await res.json()
    return data as EventSession
  } catch (error) {
    console.error("Error updating event:", error)
    throw error
  }
}
