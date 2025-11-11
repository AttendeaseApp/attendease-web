import { EventLocation } from "./location-interface"

/**
 * EventStatus enum representing the status of an event.
 */
export enum EventStatus {
     UPCOMING = "UPCOMING",
     REGISTRATION = "REGISTRATION",
     ONGOING = "ONGOING",
     CONCLUDED = "CONCLUDED",
     CANCELLED = "CANCELLED",
     FINALIZED = "FINALIZED",
}

/**
 * EligibilityCriteria interface representing eligibility criteria for an event.
 */
export interface EligibilityCriteria {
     [key: string]: string | undefined
}

/**
 * EventSession interface representing an event session.
 */
export interface EventSession {
     eventId: string
     eventName: string
     eventLocation?: EventLocation | null
     eventLocationId?: string | null
     description?: string | null
     eligibleStudents?: EligibilityCriteria | null
     timeInRegistrationStartDateTime: string
     startDateTime: string
     endDateTime: string
     eventStatus: EventStatus
     createdByUserId?: string | null
     createdAt?: string | null
     updatedAt?: string | null
}
