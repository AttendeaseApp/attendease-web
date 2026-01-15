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
     clusters?: string[]
     courses?: string[]
     sections?: string[]
     targetYearLevels?: number[]
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
     eligibilityDescription?: string
     registrationDateTime: string
     startingDateTime: string
     endingDateTime: string
     eventStatus: EventStatus
     academicYearName: string
     semesterName: string
     facialVerificationEnabled?: boolean
     attendanceLocationMonitoringEnabled?: boolean
     strictLocationValidation?: boolean
     createdByUserId?: string | null
     createdAt?: string | null
     updatedAt?: string | null
}

export interface EventResponse {
     eventId: string
     eventName: string
     description?: string | null
     registrationLocationId?: string | null
     registrationLocationName: string
     venueLocationId?: string | null
     venueLocationName: string
     allStudents: boolean
     clusters?: string[]
     courses?: string[]
     sections?: string[]
     targetYearLevels?: number[]
     eligibilityDescription?: string
     registrationDateTime: string
     startingDateTime: string
     endingDateTime: string
     eventStatus: EventStatus
     academicYearName: string
     semesterName: string
     facialVerificationEnabled?: boolean
     attendanceLocationMonitoringEnabled?: boolean
     strictLocationValidation?: boolean
     createdByUserId?: string | null
     createdAt?: string | null
     updatedAt?: string | null
}
