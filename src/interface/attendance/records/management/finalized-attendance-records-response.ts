import { EventStatus } from "@/interface/event-interface"

/**
 * FinalizedAttendanceRecordsResponse interface representing an summary of attendance records.
 */
export interface FinalizedAttendanceRecordsResponse {
     eventId: string
     eventName: string
     locationName: string
     timeInRegistrationStartDateTime: string
     startDateTime: string
     endDateTime: string
     eventStatus: EventStatus
     totalPresent: number
     totalAbsent: number
     totalIdle: number
     totalLate: number
}
