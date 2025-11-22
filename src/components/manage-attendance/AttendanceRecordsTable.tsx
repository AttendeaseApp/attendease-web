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
import {
     DropdownMenu,
     DropdownMenuTrigger,
     DropdownMenuContent,
     DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { FinalizedAttendanceRecordsResponse } from "@/interface/attendance/records/management/FinalizedAttendanceRecordsResponse"

interface AttendanceRecordsTableProps {
     events: FinalizedAttendanceRecordsResponse[]
     loading: boolean
}

export function AttendanceRecordsTable({ events, loading }: AttendanceRecordsTableProps) {
     const router = useRouter()

     return (
          <Table>
               <TableHeader className="bg-gray-100">
                    <TableRow>
                         <TableHead className="font-semibold text-gray-900">EVENT</TableHead>
                         <TableHead className="font-semibold text-gray-900">VENUE</TableHead>
                         <TableHead className="font-semibold text-gray-900">
                              REGISTRATION (DATE-TIME)
                         </TableHead>
                         <TableHead className="font-semibold text-gray-900">
                              START (DATE-TIME)
                         </TableHead>
                         <TableHead className="font-semibold text-gray-900">
                              END (DATE-TIME)
                         </TableHead>
                         <TableHead className="font-semibold text-gray-900">PRESENT</TableHead>
                         <TableHead className="font-semibold text-gray-900">ABSENTEES</TableHead>
                         <TableHead className="font-semibold text-gray-900">LATE</TableHead>
                         <TableHead className="text-right font-semibold text-gray-900"></TableHead>
                    </TableRow>
               </TableHeader>
               <TableBody>
                    {loading ? (
                         <TableRow>
                              <TableCell colSpan={9} className="text-center py-8">
                                   Loading events...
                              </TableCell>
                         </TableRow>
                    ) : events.length === 0 ? (
                         <TableRow>
                              <TableCell colSpan={9} className="text-center py-8">
                                   No events found
                              </TableCell>
                         </TableRow>
                    ) : (
                         events.map((event) => (
                              <TableRow key={event.eventId}>
                                   <TableCell className="font-medium">{event.eventName}</TableCell>
                                   <TableCell className="font-medium">
                                        {event.locationName ?? "No location"}
                                   </TableCell>
                                   <TableCell>
                                        {new Date(
                                             event.timeInRegistrationStartDateTime
                                        ).toLocaleString()}
                                   </TableCell>
                                   <TableCell>
                                        {new Date(event.startDateTime).toLocaleString()}
                                   </TableCell>
                                   <TableCell>
                                        {new Date(event.endDateTime).toLocaleString()}
                                   </TableCell>
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
                                             View all records
                                        </Button>
                                   </TableCell>
                              </TableRow>
                         ))
                    )}
               </TableBody>
          </Table>
     )
}
