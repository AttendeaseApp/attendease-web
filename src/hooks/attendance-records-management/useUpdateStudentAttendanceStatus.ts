import { useState } from "react"
import { authFetch } from "@/services/auth-fetch"
import { ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS } from "@/constants/api"
import { AttendanceStatusValue } from "@/interface/attendance/status/AttendanceStatus"
import { AttendeesResponse } from "@/interface/attendance/records/management/AttendeesResponse"
interface UpdateData {
     status: AttendanceStatusValue
     reason: string
}
interface UseUpdateAttendanceReturn {
     handleUpdate: (data: UpdateData, selectedAttendee: AttendeesResponse | null) => Promise<void>
     submitting: boolean
}
export function useUpdateAttendance(
     eventId: string,
     refetch: (() => void) | (() => Promise<void>)
): UseUpdateAttendanceReturn {
     const [submitting, setSubmitting] = useState(false)
     const handleUpdate = async (data: UpdateData, selectedAttendee: AttendeesResponse | null) => {
          if (!selectedAttendee) {
               throw new Error("Selected attendee is missing")
          }
          setSubmitting(true)
          try {
               const studentId = selectedAttendee.studentId
               if (!studentId) {
                    throw new Error("Student ID is missing")
               }
               const response = await authFetch(
                    ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS.UPDATE_STUDENT_ATTENDANCE_STATUS_BY_STUDENT_AND_EVENT_ID(
                         studentId,
                         eventId
                    ),
                    {
                         method: "PUT",
                         body: JSON.stringify(data),
                    }
               )
               if (!response.ok) {
                    throw new Error(`Update failed: ${response.statusText}`)
               }
               await refetch()
          } catch (err) {
               console.error("Update error:", err)
               alert(err instanceof Error ? err.message : "Update failed")
               throw err
          } finally {
               setSubmitting(false)
          }
     }
     return { handleUpdate, submitting }
}
