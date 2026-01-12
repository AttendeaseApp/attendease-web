import { AttendeesResponse } from "./AttendeesResponse"

export interface GroupedAttendees {
     groupName: string
     count: number
     attendees: AttendeesResponse[]

     clusterName?: string
     courseName?: string
     sectionName?: string
     yearLevel?: number
}

export interface SortedAttendanceRecordsResponse {
     eventId: string
     eventName: string
     sortBy: string
     totalAttendees: number
     groupedAttendees: Record<string, GroupedAttendees>
}
