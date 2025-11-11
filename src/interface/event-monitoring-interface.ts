import { AttendanceStatus } from "./attendance-status"
import { AccountStatus } from "./account-status"
import { UserType } from "./user-type"

export interface AttendeesResponse {
     attendanceRecordId: string
     userId: string
     firstName: string
     lastName: string
     timeIn: string
     timeOut: string
     attendanceStatus: keyof AttendanceStatus
     email: string
     contactNumber: string
     accountStatus: AccountStatus
     reason?: string
     userType: UserType
     createdAt: string
     updatedAt: string
     studentId?: string
     studentNumber?: string
     section?: string
     course?: string
}

export interface EventAttendeesResponse {
     totalAttendees: number
     attendees: AttendeesResponse[]
}
