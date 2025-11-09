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

export const createEvent = async (
  newEventData: Partial<EventSession> & { eventLocationId: string }
): Promise<EventSession> => {
  try {
    const payload = { ...newEventData }
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

    const res = await authFetch(EVENT_MANAGEMENT_API_ENDPOINTS.CREATE_EVENT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      let errorMsg = `Failed to create event: ${res.status}`
      try {
        const errorBody = await res.json()
        errorMsg =
          errorBody.error ||
          errorBody.message ||
          (Array.isArray(errorBody.errors) ? errorBody.errors[0]?.defaultMessage : errorBody)
      } catch (parseErr) {
        errorMsg = res.statusText || errorMsg
      }
      throw new Error(errorMsg)
    }

    const data = await res.json()
    return data as EventSession
  } catch (error) {
    console.error("Error creating event:", error)
    throw error
  }
}

/**
 * Delete an event by ID from the API.
 * @param id The ID of the event to delete
 * @returns Promise<void>
 */
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const res = await authFetch(EVENT_MANAGEMENT_API_ENDPOINTS.DELETE_EVENT(id), {
      method: "DELETE",
    })
    if (!res.ok) {
      let errorMsg = `Failed to delete event: ${res.status}`
      try {
        const errorBody = await res.json()
        errorMsg =
          errorBody.error ||
          errorBody.message ||
          (Array.isArray(errorBody.errors) ? errorBody.errors[0]?.defaultMessage : errorBody)
      } catch (parseErr) {
        errorMsg = res.statusText || errorMsg
      }
      throw new Error(errorMsg)
    }
  } catch (error) {
    console.error("Error deleting event:", error)
    throw error
  }
}
