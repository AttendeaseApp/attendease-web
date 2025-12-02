import { AttendanceStatusValue } from "../status/AttendanceStatus"
import { EventSession } from "@/interface/event/event-interface"
import { EventLocation } from "@/interface/location-interface"
import { AttendanceTrackingResponse } from "../tracking/AttendanceTrackingResponse"
import { Students } from "@/interface/students/Students"

export interface AttendanceRecords {
     recordId: string
     student: Students
     event: EventSession
     location?: EventLocation
     timeIn: string
     timeOut: string
     reason: string
     attendanceStatus: AttendanceStatusValue
     attendancePingLogs: AttendanceTrackingResponse[]
     updatedByUserId?: string
     createdAt: string
     updatedAt?: string
}
