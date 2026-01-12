"use client"

import { Button } from "@/components/ui/button"
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { useRouter } from "next/navigation"
import { FinalizedAttendanceRecordsResponse } from "@/interface/attendance/records/management/FinalizedAttendanceRecordsResponse"
import { CalendarX2, Loader2 } from "lucide-react"

interface AttendanceRecordsTableProps {
     events: FinalizedAttendanceRecordsResponse[]
     loading: boolean
}

export function AttendanceRecordsTable({ events, loading }: AttendanceRecordsTableProps) {
     const router = useRouter()

     if (loading) {
          return (
               <Empty>
                    <EmptyHeader>
                         <EmptyMedia variant="icon">
                              <Loader2 className="animate-spin" />
                         </EmptyMedia>
                         <EmptyTitle>Loading events...</EmptyTitle>
                         <EmptyDescription>
                              Please wait while we fetch the attendance records.
                         </EmptyDescription>
                    </EmptyHeader>
               </Empty>
          )
     }

     if (events.length === 0) {
          return (
               <Empty>
                    <EmptyHeader>
                         <EmptyMedia variant="icon">
                              <CalendarX2 />
                         </EmptyMedia>
                         <EmptyTitle>No events found</EmptyTitle>
                         <EmptyDescription>
                              There are no finalized attendance records matching your current
                              filters. Try adjusting your search criteria or filters.
                         </EmptyDescription>
                    </EmptyHeader>
               </Empty>
          )
     }

     return (
          <Table>
               <TableHeader>
                    <TableRow>
                         <TableHead className="font-semibold text-gray-900">Event</TableHead>
                         <TableHead className="font-semibold text-gray-900">Venue</TableHead>
                         <TableHead className="font-semibold text-gray-900">
                              Registration Location
                         </TableHead>
                         <TableHead className="font-semibold text-gray-900">
                              Registration (DATE-TIME)
                         </TableHead>
                         <TableHead className="font-semibold text-gray-900">
                              Started (DATE-TIME)
                         </TableHead>
                         <TableHead className="font-semibold text-gray-900">
                              Ended (DATE-TIME)
                         </TableHead>
                         <TableHead className="font-semibold text-gray-900">Present</TableHead>
                         <TableHead className="font-semibold text-gray-900">Absentees</TableHead>
                         <TableHead className="font-semibold text-gray-900">Late</TableHead>
                         <TableHead className="text-right font-semibold text-gray-900"></TableHead>
                    </TableRow>
               </TableHeader>
               <TableBody>
                    {events.map((event) => (
                         <TableRow key={event.eventId}>
                              <TableCell>{event.eventName}</TableCell>
                              <TableCell>{event.venueLocationName ?? "No location"}</TableCell>
                              <TableCell>
                                   {event.registrationLocationName ?? "No location"}
                              </TableCell>
                              <TableCell>{event.registrationDateTime}</TableCell>
                              <TableCell>{event.startingDateTime}</TableCell>
                              <TableCell>{event.endingDateTime}</TableCell>
                              <TableCell>{event.totalPresent}</TableCell>
                              <TableCell>{event.totalAbsent}</TableCell>
                              <TableCell>{event.totalLate}</TableCell>
                              <TableCell className="text-right">
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                             router.push(
                                                  `manage-attendance/events/${event.eventId}/attendees`
                                             )
                                        }
                                   >
                                        View records
                                   </Button>
                              </TableCell>
                         </TableRow>
                    ))}
               </TableBody>
          </Table>
     )
}
