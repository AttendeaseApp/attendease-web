"use client"

import { EventSession } from "@/interface/event/event-interface"
import { Button } from "@/components/ui/button"
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { CalendarDays, Loader2 } from "lucide-react"
import { EventStatusText } from "../event/event-status-text"

interface EventTableProps {
     events: EventSession[]
     loading: boolean
     onViewAttendees: (eventId: string, eventName: string) => void
}

export function EventTable({ events, loading, onViewAttendees }: EventTableProps) {
     if (loading) {
          return (
               <Empty>
                    <EmptyHeader>
                         <EmptyMedia variant="icon">
                              <Loader2 className="animate-spin" />
                         </EmptyMedia>
                         <EmptyTitle>Loading events...</EmptyTitle>
                         <EmptyDescription>
                              Please wait while we fetch the event data.
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
                              <CalendarDays />
                         </EmptyMedia>
                         <EmptyTitle>No active events found</EmptyTitle>
                         <EmptyDescription>There are no active events found.</EmptyDescription>
                    </EmptyHeader>
               </Empty>
          )
     }

     return (
          <Table className="w-full">
               <TableHeader>
                    <TableRow>
                         <TableHead className="font-semibold text-gray-900">Events</TableHead>
                    </TableRow>
               </TableHeader>

               <TableBody>
                    {events.map((event) => (
                         <TableRow key={event.eventId} className="align-top">
                              <TableCell className="py-4">
                                   <div>
                                        {/* Header */}
                                        <div className="flex items-start justify-between gap-4">
                                             <div className="space-y-1">
                                                  <EventStatusText status={event.eventStatus} />
                                                  <div className="font-semibold text-gray-900 text-lg">
                                                       {event.eventName}
                                                  </div>
                                             </div>

                                             <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={() =>
                                                       onViewAttendees(
                                                            event.eventId,
                                                            event.eventName
                                                       )
                                                  }
                                             >
                                                  View attendees
                                             </Button>
                                        </div>

                                        {/* Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-sm text-gray-700">
                                             <div className="space-y-1">
                                                  <div>
                                                       <span className="font-medium">
                                                            Academic Year:
                                                       </span>{" "}
                                                       {event.academicYearName}
                                                  </div>
                                                  <div>
                                                       <span className="font-medium">
                                                            Semester:
                                                       </span>{" "}
                                                       {event.semesterName}
                                                  </div>
                                                  <div>
                                                       <span className="font-medium">
                                                            Eligibility:
                                                       </span>{" "}
                                                       {event.eligibilityDescription}
                                                  </div>
                                             </div>

                                             <div className="space-y-1">
                                                  <div>
                                                       <span className="font-medium">
                                                            Registration Location:
                                                       </span>{" "}
                                                       {event.registrationLocationName ??
                                                            "No location"}
                                                  </div>
                                                  <div>
                                                       <span className="font-medium">
                                                            Event Venue:
                                                       </span>{" "}
                                                       {event.venueLocationName ?? "No location"}
                                                  </div>
                                             </div>

                                             <div className="space-y-1">
                                                  <div>
                                                       <span className="font-medium">
                                                            Registration:
                                                       </span>{" "}
                                                       {new Date(
                                                            event.registrationDateTime
                                                       ).toLocaleString()}
                                                  </div>
                                                  <div>
                                                       <span className="font-medium">
                                                            Starting:
                                                       </span>{" "}
                                                       {new Date(
                                                            event.startingDateTime
                                                       ).toLocaleString()}
                                                  </div>
                                                  <div>
                                                       <span className="font-medium">Ending:</span>{" "}
                                                       {new Date(
                                                            event.endingDateTime
                                                       ).toLocaleString()}
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
