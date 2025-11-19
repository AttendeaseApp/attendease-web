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
import { FinalizedAttendanceRecordsResponse } from "@/interface/attendance/records/management/finalized-attendance-records-response"

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
                         <TableHead className="font-semibold text-gray-900">Event Name</TableHead>
                         <TableHead className="font-semibold text-gray-900">Venue</TableHead>
                         <TableHead className="font-semibold text-gray-900">Registration</TableHead>
                         <TableHead className="font-semibold text-gray-900">
                              Start Date-Time
                         </TableHead>
                         <TableHead className="font-semibold text-gray-900">
                              End Date-Time
                         </TableHead>
                         <TableHead className="font-semibold text-gray-900">
                              Total Present
                         </TableHead>
                         <TableHead className="font-semibold text-gray-900">Total Absent</TableHead>
                         <TableHead className="font-semibold text-gray-900">Total Late</TableHead>
                         <TableHead className="text-right font-semibold text-gray-900">
                              Actions
                         </TableHead>
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
                                        <DropdownMenu>
                                             <DropdownMenuTrigger asChild>
                                                  <Button variant="ghost" size="sm">
                                                       <MoreHorizontal className="h-4 w-4" />
                                                       <span className="sr-only">Open menu</span>
                                                  </Button>
                                             </DropdownMenuTrigger>
                                             <DropdownMenuContent align="end">
                                                  <DropdownMenuItem
                                                       onClick={() =>
                                                            router.push(
                                                                 `manage-attendance/events/${event.eventId}/attendees`
                                                            )
                                                       }
                                                  >
                                                       View all records
                                                  </DropdownMenuItem>
                                             </DropdownMenuContent>
                                        </DropdownMenu>
                                   </TableCell>
                              </TableRow>
                         ))
                    )}
               </TableBody>
          </Table>
     )
}
