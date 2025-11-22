"use client"

import { EventSession, EventStatus } from "@/interface/event/event-interface"
import { cn } from "@/lib/utils"
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
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"

interface EventTableProps {
     events: EventSession[]
     loading: boolean
     onEdit: (event: EventSession) => void
     onDelete: (event: EventSession) => void
}

/**
 * EventTable component for displaying a table of event sessions.
 *
 * @param param0 as EventTableProps
 * @returns JSX.Element The EventTable component.
 */
export function EventTable({ events, loading, onEdit, onDelete }: EventTableProps) {
     const handleEdit = (event: EventSession, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          onEdit(event)
     }

     const handleDelete = (event: EventSession, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          if (
               confirm(
                    `Are you sure you want to delete the event "${event.eventName}"? This action cannot be undone.`
               )
          ) {
               onDelete(event)
          }
     }

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
                         <TableHead className="font-semibold text-gray-900">STATUS</TableHead>
                         <TableHead className="text-right font-semibold text-gray-900">
                              MORE
                         </TableHead>
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
                                   No events found
                              </TableCell>
                         </TableRow>
                    ) : (
                         events.map((event) => (
                              <TableRow key={event.eventId}>
                                   <TableCell className="font-medium">{event.eventName}</TableCell>
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
                                                       onClick={(e) => handleEdit(event, e)}
                                                  >
                                                       <Pencil className="mr-2 h-4 w-4" />
                                                       Edit
                                                  </DropdownMenuItem>
                                                  <DropdownMenuItem
                                                       onClick={(e) => handleDelete(event, e)}
                                                  >
                                                       <Trash className="mr-2 h-4 w-4" />
                                                       Delete
                                                  </DropdownMenuItem>
                                                  <DropdownMenuSeparator />
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
