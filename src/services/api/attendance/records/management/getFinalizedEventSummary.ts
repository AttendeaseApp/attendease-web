import { FinalizedAttendanceRecordsResponse } from "@/interface/attendance/records/management/FinalizedAttendanceRecordsResponse"
import { authFetch } from "@/services/auth-fetch"
import { ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS } from "@/constants/api"

export async function fetchFinalizedEventSummary(): Promise<FinalizedAttendanceRecordsResponse[]> {
     try {
          const response = await authFetch(
               ATTENDANCE_RECORDS_MANAGEMENT_ENPOINTS.GET_FINALIZED_EVENT_SUMMARY,
               {
                    method: "GET",
               }
          )

          if (!response.ok) {
               throw new Error(
                    `Failed to fetch finalized events: ${response.status} ${response.statusText}`
               )
          }

          const data: FinalizedAttendanceRecordsResponse[] = await response.json()
          return data
     } catch (error) {
          console.error("Error fetching finalized events:", error)
          throw error
     }
}
