"use client"

import { useState } from "react"
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
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "../ui/empty"
import {
     AlertDialog,
     AlertDialogAction,
     AlertDialogCancel,
     AlertDialogContent,
     AlertDialogDescription,
     AlertDialogFooter,
     AlertDialogHeader,
     AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
     DropdownMenu,
     DropdownMenuTrigger,
     DropdownMenuContent,
     DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { CalendarDays, Loader2 } from "lucide-react"

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

     const [deleteTarget, setDeleteTarget] = useState<EventSession | null>(null)
     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
     const openDeleteDialog = (event: EventSession, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          setDeleteTarget(event)
          setDeleteDialogOpen(true)
     }
     const confirmDelete = async () => {
          if (deleteTarget) {
               onDelete(deleteTarget)
          }
     }

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
          <>
               <Table>
                    <TableHeader>
                         <TableRow>
                              <TableHead className="font-semibold text-gray-900">Event</TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                   Registration Location
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                   Event Venue
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                   Eligibliity
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                   Registration (DATE-TIME)
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                   Strting (DATE-TIME)
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                   Ending (DATE-TIME)
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">Status</TableHead>
                              <TableHead className="text-right font-semibold text-gray-900">
                                   Options
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
                                   <TableCell colSpan={6} className="text-center py-8">
                                        No events found
                                   </TableCell>
                              </TableRow>
                         ) : (
                              events.map((event) => (
                                   <TableRow key={event.eventId}>
                                        <TableCell className="font-medium">
                                             {event.eventName}
                                        </TableCell>
                                        <TableCell>
                                             {event.registrationLocationName ?? "No location"}
                                        </TableCell>
                                        <TableCell>
                                             {event.venueLocationName ?? "No location"}
                                        </TableCell>
                                        <TableCell>{event.eligibilityDescription}</TableCell>
                                        <TableCell>
                                             {new Date(event.registrationDateTime).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                             {new Date(event.startingDateTime).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                             {new Date(event.endingDateTime).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                             <span
                                                  className={cn("rounded-full px-2 py-1 text-xs", {
                                                       "bg-green-100 text-green-700":
                                                            event.eventStatus ===
                                                            EventStatus.ONGOING,
                                                       "bg-yellow-100 text-yellow-700":
                                                            event.eventStatus ===
                                                            EventStatus.REGISTRATION,
                                                       "bg-blue-100 text-blue-700":
                                                            event.eventStatus ===
                                                            EventStatus.UPCOMING,
                                                       "bg-red-100 text-red-700":
                                                            event.eventStatus ===
                                                            EventStatus.CANCELLED,
                                                       "bg-gray-100":
                                                            event.eventStatus ===
                                                                 EventStatus.CONCLUDED ||
                                                            event.eventStatus ===
                                                                 EventStatus.FINALIZED,
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
                                                            <span className="sr-only">
                                                                 Open menu
                                                            </span>
                                                       </Button>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent align="end">
                                                       {event.eventStatus !==
                                                            EventStatus.FINALIZED &&
                                                            event.eventStatus !==
                                                                 EventStatus.CANCELLED && (
                                                                 <DropdownMenuItem
                                                                      onClick={(e) =>
                                                                           handleEdit(event, e)
                                                                      }
                                                                 >
                                                                      <Pencil className="mr-2 h-4 w-4" />
                                                                      Edit
                                                                 </DropdownMenuItem>
                                                            )}
                                                       <DropdownMenuItem
                                                            onClick={(e) =>
                                                                 openDeleteDialog(event, e)
                                                            }
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
               <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent className="sm:max-w-md">
                         <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                   Are you sure you want to delete the event{" "}
                                   <strong>{deleteTarget?.eventName}</strong>? This action cannot be
                                   undone and will also delete associated courses.
                              </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>
          </>
     )
}
