/**
 * EventLocation interface representing an event location.
 */
export interface EventLocation {
     locationId: string
     locationName: string
     locationEnvironment: string
     locationPurposeType: string
     description: string
     latitude: number
     longitude: number
     createdAt: string
     updatedAt: string
     coordinates?: number[][]
}

/**
 * Represents a GeoJSON Polygon geometry used for location boundaries.
 */
export interface Geometry {
     type: string
     coordinates: number[][][] // [[[lng, lat], [lng, lat], ...]]
}

/**
 * Request payload for creating or updating an event location.
 */
export interface EventLocationRequest {
     locationName: string
     locationType: string
     locationPurpose: string
     description: string
     locationGeometry: Geometry
}
