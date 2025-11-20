import { AttendanceStatus } from "@/interface/attendance/status/AttendanceStatus"
import { AccountStatus } from "@/interface/users/account/status/AccountStatus"
import { UserType } from "@/interface/users/type/UserType"

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
