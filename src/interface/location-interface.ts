/**
 * EventLocation interface representing an event location.
 */
export interface EventLocation {
  locationId: string
  locationName: string
  locationType: string
  latitude: number
  longitude: number
  createdAt: string
  updatedAt: string
}

export interface EventLocationRequest {
  locationName: string
  locationType: string
  geoJson: string
}
