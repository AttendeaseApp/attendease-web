"use client"

import { useState } from "react"
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
import { Pencil, Trash, CalendarDays, Loader2 } from "lucide-react"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { EventStatusText } from "../event/event-status-text"

interface EventTableProps {
     events: EventSession[]
     loading: boolean
     onEdit: (event: EventSession) => void
     onDelete: (event: EventSession) => void
}

export function EventTable({ events, loading, onEdit, onDelete }: EventTableProps) {
     const [deleteTarget, setDeleteTarget] = useState<EventSession | null>(null)
     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

     const handleEdit = (event: EventSession, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          onEdit(event)
     }

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
               <Table className="w-full">
                    {/* HEADER */}
                    <TableHeader>
                         <TableRow>
                              <TableHead className="font-semibold text-gray-900">Events</TableHead>
                         </TableRow>
                    </TableHeader>

                    {/* BODY */}
                    <TableBody>
                         {events.map((event) => (
                              <TableRow key={event.eventId} className="align-top">
                                   <TableCell className="py-4">
                                        <div>
                                             {/* Top row */}
                                             <div className="flex items-start justify-between gap-4">
                                                  <div className="space-y-1">
                                                       <EventStatusText
                                                            status={event.eventStatus}
                                                       />
                                                       <div className="font-semibold text-gray-900 text-lg">
                                                            {event.eventName}
                                                       </div>
                                                  </div>

                                                  <DropdownMenu>
                                                       <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                 Options
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
                                                                 className="text-red-600"
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
                                                            {event.venueLocationName ??
                                                                 "No location"}
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
                                                            <span className="font-medium">
                                                                 Ending:
                                                            </span>{" "}
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
