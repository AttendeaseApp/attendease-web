export interface AttendanceStatus {
     PRESENT: "PRESENT"
     ABSENT: "ABSENT"
     REGISTERED: "REGISTERED"
     IDLE: "IDLE"
     LATE: "LATE"
     EXCUSED: "EXCUSED"
}

export type AttendanceStatusValue = keyof AttendanceStatus

export const ATTENDANCE_STATUS_VALUES = [
     "PRESENT",
     "ABSENT",
     "REGISTERED",
     "IDLE",
     "LATE",
     "EXCUSED",
] as const
