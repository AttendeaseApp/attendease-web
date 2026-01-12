export interface AttendanceStatus {
     PRESENT: "PRESENT"
     ABSENT: "ABSENT"
     REGISTERED: "REGISTERED"
     PARTIALLY_REGISTERED: "PARTIALLY_REGISTERED"
     IDLE: "IDLE"
     LATE: "LATE"
     EXCUSED: "EXCUSED"
}


export type AttendanceStatusValue = keyof AttendanceStatus

export const ATTENDANCE_STATUS_VALUES = [
     "PRESENT",
     "ABSENT",
     "REGISTERED",
     "PARTIALLY_REGISTERED",
     "IDLE",
     "LATE",
     "EXCUSED",
] as const
