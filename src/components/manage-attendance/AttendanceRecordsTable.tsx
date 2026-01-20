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
                         <EmptyTitle>Loading attendance records...</EmptyTitle>
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
                         <EmptyTitle>No attendance records found</EmptyTitle>
                         <EmptyDescription>
                              There are no finalized attendance records matching your current
                              filters. Try adjusting your search criteria or filters.
                         </EmptyDescription>
                    </EmptyHeader>
               </Empty>
          )
     }

     return (
          <Table className="w-full rounded-lg">
               {/* HEADER */}
               <TableHeader>
                    <TableRow>
                         <TableHead className="font-semibold text-gray-900">
                              Attendance Records
                         </TableHead>
                    </TableRow>
               </TableHeader>

               {/* BODY */}
               <TableBody>
                    {events.map((event) => (
                         <TableRow key={event.eventId} className="align-top">
                              <TableCell className="py-4">
                                   <div>
                                        <div className="flex items-start justify-between gap-4">
                                             <div className="space-y-1">
                                                  <div className="font-semibold text-gray-900 text-lg">
                                                       {event.eventName}
                                                  </div>
                                                  <div className="text-sm text-muted-foreground">
                                                       {event.venueLocationName ?? "No venue"}
                                                  </div>
                                             </div>

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
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                                             <div className="text-sm text-gray-700">
                                                  <div>
                                                       <span className="font-medium">
                                                            Registration Location:
                                                       </span>{" "}
                                                       {event.registrationLocationName ??
                                                            "No location"}
                                                  </div>
                                                  <div>
                                                       <span className="font-medium">
                                                            Registration:
                                                       </span>{" "}
                                                       {event.registrationDateTime}
                                                  </div>
                                             </div>

                                             <div className="text-sm text-gray-700">
                                                  <div>
                                                       <span className="font-medium">Started:</span>{" "}
                                                       {event.startingDateTime}
                                                  </div>
                                                  <div>
                                                       <span className="font-medium">Ended:</span>{" "}
                                                       {event.endingDateTime}
                                                  </div>
                                             </div>

                                             <div className="grid grid-cols-3 gap-2">
                                                  <div className="p-2 rounded border bg-green-50">
                                                       <div className="text-xs text-green-700">
                                                            Present
                                                       </div>
                                                       <div className="font-bold text-lg text-green-800">
                                                            {event.totalPresent}
                                                       </div>
                                                  </div>
                                                  <div className="p-2 rounded border bg-red-50">
                                                       <div className="text-xs text-red-700">
                                                            Absentees
                                                       </div>
                                                       <div className="font-bold text-lg text-red-800">
                                                            {event.totalAbsent}
                                                       </div>
                                                  </div>
                                                  <div className="p-2 rounded border bg-yellow-50">
                                                       <div className="text-xs text-yellow-700">
                                                            Late
                                                       </div>
                                                       <div className="font-bold text-lg text-yellow-800">
                                                            {event.totalLate}
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </TableCell>
                         </TableRow>
                    ))}
               </TableBody>
          </Table>
     )
}
