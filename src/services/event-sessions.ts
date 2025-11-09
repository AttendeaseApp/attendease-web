import { EventSession } from "@/interface/event-interface"
import { authFetch } from "./auth-fetch"
import { EVENT_MANAGEMENT_API_ENDPOINTS } from "@/constants/api"

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
