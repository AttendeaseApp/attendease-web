import { EventStatus } from "@/interface/event/event-interface"

/**
 * FinalizedAttendanceRecordsResponse interface representing an summary of attendance records.
 */
export interface FinalizedAttendanceRecordsResponse {
     eventId: string
     eventName: string
     registrationLocationName: string
     venueLocationName: string
     registrationDateTime: string
     startingDateTime: string
     endingDateTime: string
     eventStatus: EventStatus
     totalPresent: number
     totalAbsent: number
     totalIdle: number
     totalLate: number
}
