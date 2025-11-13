"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { EventSession, EventStatus } from "@/interface/event-interface"
import { Button } from "@/components/ui/button"
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"

interface EventTableProps {
     events: EventSession[]
     loading: boolean
     onViewAttendees: (eventId: string) => void
}

export const EventTable: React.FC<EventTableProps> = ({ events, loading, onViewAttendees }) => {
     if (events.length === 0) {
          return <p className="text-muted-foreground">No events found.</p>
     }

     return (
          <Table>
               <TableHeader className="bg-gray-100">
                    <TableRow>
                         <TableHead className="font-semibold text-gray-900">Event Name</TableHead>
                         <TableHead className="font-semibold text-gray-900">Venue</TableHead>
                         <TableHead className="font-semibold text-gray-900">
                              Registration Start
                         </TableHead>
                         <TableHead className="font-semibold text-gray-900">Start Date</TableHead>
                         <TableHead className="font-semibold text-gray-900">End Date</TableHead>
                         <TableHead className="font-semibold text-gray-900">Status</TableHead>
                         <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                    </TableRow>
               </TableHeader>
               <TableBody>
                    {loading ? (
                         <TableRow>
                              <TableCell colSpan={6} className="text-center py-8">
                                   Loading events...
                              </TableCell>
                         </TableRow>
                    ) : events.length === 0 ? (
                         <TableRow>
                              <TableCell colSpan={6} className="text-center py-8">
                                   There are no ONGOING, UPCOMING, or even REGISTRATION events has
                                   found
                              </TableCell>
                         </TableRow>
                    ) : (
                         events.map((event) => (
                              <TableRow key={event.eventId}>
                                   <TableCell>{event.eventName}</TableCell>
                                   <TableCell className="font-medium">
                                        {event.eventLocation?.locationName ?? "No location"}
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
                                   <TableCell>
                                        <span
                                             className={cn("rounded-full px-2 py-1 text-xs", {
                                                  "bg-green-100 text-green-700":
                                                       event.eventStatus === EventStatus.ONGOING,
                                                  "bg-yellow-100 text-yellow-700":
                                                       event.eventStatus ===
                                                       EventStatus.REGISTRATION,
                                                  "bg-blue-100 text-blue-700":
                                                       event.eventStatus === EventStatus.UPCOMING,
                                                  "bg-red-100 text-red-700":
                                                       event.eventStatus === EventStatus.CANCELLED,
                                                  "bg-gray-100":
                                                       event.eventStatus ===
                                                            EventStatus.CONCLUDED ||
                                                       event.eventStatus === EventStatus.FINALIZED,
                                             })}
                                        >
                                             {event.eventStatus}
                                        </span>
                                   </TableCell>

                                   <TableCell>
                                        <Button
                                             size="sm"
                                             variant="outline"
                                             onClick={() => onViewAttendees(event.eventId)}
                                        >
                                             View Registered Attendees
                                        </Button>
                                   </TableCell>
                              </TableRow>
                         ))
                    )}
               </TableBody>
          </Table>
     )
}
