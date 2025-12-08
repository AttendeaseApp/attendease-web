import { EventLocation } from "../location-interface"

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
     allStudents: boolean
     cluster?: string[]
     course?: string[]
     sections?: string[]
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
     eligibleStudents?: EligibilityCriteria
     timeInRegistrationStartDateTime: string
     startDateTime: string
     endDateTime: string
     eventStatus: EventStatus
     facialVerificationEnabled?: boolean
     createdByUserId?: string | null
     createdAt?: string | null
     updatedAt?: string | null
}
