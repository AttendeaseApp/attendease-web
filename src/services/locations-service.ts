import { EventLocation, EventLocationRequest } from "@/interface/location-interface"
import { authFetch } from "./auth-fetch"
import { LOCATION_MANAGEMENT_API_ENDPOINTS } from "@/constants/api"

export const getAllLocations = async (): Promise<EventLocation[]> => {
  try {
    const res = await authFetch(LOCATION_MANAGEMENT_API_ENDPOINTS.GET_ALL_LOCATIONS)
    if (!res.ok) {
      throw new Error(`Failed to fetch events: ${res.status}`)
    }
    const data = await res.json()
    return data as EventLocation[]
  } catch (error) {
    console.error("Error fetching events:", error)
    throw error
  }
}

/**
 * Create a new event location.
 *
 * @param payload EventLocationRequest object containing name, type, and geoJsonData.
 * @returns The created EventLocation.
 */
export const createLocation = async (payload: EventLocationRequest): Promise<EventLocation> => {
  try {
    const res = await authFetch(LOCATION_MANAGEMENT_API_ENDPOINTS.CREATE_LOCATION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      throw new Error(`Failed to create location: ${res.status}`)
    }

    const data = await res.json()
    return data as EventLocation
  } catch (error) {
    console.error("Error creating location:", error)
    throw error
  }
}
