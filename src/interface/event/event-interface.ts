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
     description?: string | null
     registrationLocationId?: string | null
     registrationLocationName: string
     venueLocationId?: string | null
     venueLocationName: string
     eligibleStudents?: EligibilityCriteria
     registrationDateTime: string
     startingDateTime: string
     endingDateTime: string
     eventStatus: EventStatus
     facialVerificationEnabled?: boolean
     attendanceLocationMonitoringEnabled?: boolean
     strictLocationValidation?: boolean
     createdByUserId?: string | null
     createdAt?: string | null
     updatedAt?: string | null
}
