"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { EventSession, EventStatus } from "@/interface/event/event-interface"
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
import { CalendarClock, Loader2 } from "lucide-react"

interface EventTableProps {
     events: EventSession[]
     loading: boolean
     onViewAttendees: (eventId: string, eventName: string) => void
}

export const EventTable: React.FC<EventTableProps> = ({ events, loading, onViewAttendees }) => {
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
                              <CalendarClock />
                         </EmptyMedia>
                         <EmptyTitle>No events found</EmptyTitle>
                         <EmptyDescription>
                              There are no upcoming, registration, or ongoing events at this time.
                              Check back later or adjust your search filters.
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
                         <TableHead className="font-semibold text-gray-900">
                              Registration Location
                         </TableHead>
                         <TableHead className="font-semibold text-gray-900">Event Venue</TableHead>
                         <TableHead className="font-semibold text-gray-900">
                              Registration (Date-Time)
                         </TableHead>
                         <TableHead className="font-semibold text-gray-900">
                              Start (Date-Time)
                         </TableHead>
                         <TableHead className="font-semibold text-gray-900">
                              End (Date-Time)
                         </TableHead>
                         <TableHead className="font-semibold text-gray-900">Status</TableHead>
                         <TableHead className="text-right font-semibold text-gray-900"></TableHead>
                    </TableRow>
               </TableHeader>
               <TableBody>
                    {events.map((event) => (
                         <TableRow key={event.eventId}>
                              <TableCell>{event.eventName}</TableCell>
                              <TableCell>
                                   {event.registrationLocationName ?? "No location"}
                              </TableCell>
                              <TableCell>{event.venueLocationName ?? "No location"}</TableCell>
                              <TableCell className="text-sm">
                                   {new Date(event.registrationDateTime).toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                   })}
                              </TableCell>
                              <TableCell className="text-sm">
                                   {new Date(event.startingDateTime).toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                   })}
                              </TableCell>
                              <TableCell className="text-sm">
                                   {new Date(event.endingDateTime).toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                   })}
                              </TableCell>
                              <TableCell>
                                   <span
                                        className={cn(
                                             "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset",
                                             {
                                                  "bg-green-100 text-green-800 ring-green-600/20":
                                                       event.eventStatus === EventStatus.ONGOING,
                                                  "bg-yellow-100 text-yellow-800 ring-yellow-600/20":
                                                       event.eventStatus ===
                                                       EventStatus.REGISTRATION,
                                                  "bg-blue-100 text-blue-800 ring-blue-600/20":
                                                       event.eventStatus === EventStatus.UPCOMING,
                                                  "bg-red-100 text-red-800 ring-red-600/20":
                                                       event.eventStatus === EventStatus.CANCELLED,
                                                  "bg-gray-100 text-gray-800 ring-gray-600/20":
                                                       event.eventStatus ===
                                                            EventStatus.CONCLUDED ||
                                                       event.eventStatus === EventStatus.FINALIZED,
                                             }
                                        )}
                                   >
                                        {event.eventStatus}
                                   </span>
                              </TableCell>

                              <TableCell className="text-right">
                                   <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                             onViewAttendees(event.eventId, event.eventName)
                                        }
                                   >
                                        View Attendees
                                   </Button>
                              </TableCell>
                         </TableRow>
                    ))}
               </TableBody>
          </Table>
     )
}
