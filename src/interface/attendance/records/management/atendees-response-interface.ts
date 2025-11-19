import { AttendanceStatus } from "@/interface/attendance-status"

export interface AttendeesResponse {
     userId: string
     firstName: string
     lastName: string
     email: string
     contactNumber: string
     accountStatus: string
     userType: string
     createdAt: string
     updatedAt: string
     studentId: string
     studentNumber: string
     section: string
     course: string
     attendanceStatus: keyof AttendanceStatus
     reason: string | null
     timeIn: string
     timeOut: string | null
     attendanceRecordId: string
}

export interface EventAttendeesResponse {
     totalAttendees: number
     attendees: AttendeesResponse[]
}
