"use client"

import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { EventAttendeesTable } from "@/components/manage-attendance/EventAttendeesTable"
import { UpdateStudentAttendanceRecordDialog } from "@/components/manage-attendance/UpdateStudentAttendanceRecordDialog"
import { Button } from "@/components/ui/button"
import { useEventAttendees } from "@/hooks/attendance-records-management/useEventAttendees"
import { useEventById } from "@/hooks/attendance-records-management/useEventById"
import { useUpdateAttendance } from "@/hooks/attendance-records-management/useUpdateStudentAttendanceStatus"
import { AttendeesResponse } from "@/interface/attendance/records/management/AttendeesResponse"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
     Breadcrumb,
     BreadcrumbItem,
     BreadcrumbLink,
     BreadcrumbList,
     BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"

export default function EventAttendeesPage() {
     const params = useParams()
     const eventId = params.eventId as string
     const [open, setOpen] = useState(false)
     const [selectedAttendee, setSelectedAttendee] = useState<AttendeesResponse | null>(null)
     const { data: event, loading: eventLoading } = useEventById(eventId)
     const { data: attendeesResponse, loading, error, refetch } = useEventAttendees(eventId)
     const [searchTerm, setSearchTerm] = useState("")
     const attendees = attendeesResponse?.attendees ?? []
     const totalAttendees = attendeesResponse?.totalAttendees ?? 0
     const { handleUpdate, submitting } = useUpdateAttendance(eventId, refetch)
     useEffect(() => {
          if (error) {
               toast.error(error.message)
          }
     }, [error])
     const handleOpenDialog = (attendee: AttendeesResponse) => {
          setSelectedAttendee(attendee)
          setOpen(true)
     }
     const handleCloseDialog = () => {
          setOpen(false)
          setSelectedAttendee(null)
     }
     const handleSearchChange = (term: string) => {
          setSearchTerm(term)
     }
     if (eventLoading || loading) {
          return (
               <ProtectedLayout>
                    <div className="p-4 text-center">
                         <div className="flex flex-col items-center gap-2">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                              <p>Loading event details...</p>
                         </div>
                    </div>
               </ProtectedLayout>
          )
     }
     return (
          <ProtectedLayout>
               <div key={eventId} className="flex flex-col w-full h-full min-w-0 gap-6">
                    <div>
                         <Breadcrumb>
                              <BreadcrumbList>
                                   <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                             <Link href="/manage-attendance">
                                                  Manage Attendance Records
                                             </Link>
                                        </BreadcrumbLink>
                                   </BreadcrumbItem>
                                   <BreadcrumbSeparator />
                                   <BreadcrumbItem>
                                        <BreadcrumbLink>
                                             {event?.eventName || "Event"}
                                        </BreadcrumbLink>
                                   </BreadcrumbItem>
                              </BreadcrumbList>
                         </Breadcrumb>
                    </div>
                    <div className="space-y-4">
                         <h1 className="text-2xl font-bold md:text-3xl">
                              {event?.eventName || "Event"}
                         </h1>
                         {event && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
                                   <div>
                                        <strong>Event Description:</strong>
                                        <br />
                                        {event.description || "N/A"}
                                   </div>
                                   <div>
                                        <strong>Venue:</strong>
                                        <br />
                                        {event.eventLocation?.locationName || "N/A"}
                                   </div>
                                   <div>
                                        <strong>Registration:</strong>
                                        <br />
                                        {event.timeInRegistrationStartDateTime || "N/A"}
                                   </div>
                                   <div>
                                        <strong>Start:</strong> {event.startDateTime || "N/A"}
                                   </div>
                                   <div>
                                        <strong>End:</strong> {event.endDateTime || "N/A"}
                                   </div>
                                   <div className="flex justify-end md:col-span-2">
                                        <Button
                                             onClick={() => window.print()}
                                             className="transition-all duration-200"
                                        >
                                             Print
                                        </Button>
                                   </div>
                              </div>
                         )}
                    </div>
                    <div>
                         <EventAttendeesTable
                              attendeesData={attendees}
                              totalAttendees={totalAttendees}
                              loading={loading}
                              eventId={eventId}
                              searchTerm={searchTerm}
                              onSearchChange={handleSearchChange}
                              onOpenDialog={handleOpenDialog}
                         />
                    </div>
               </div>
               <UpdateStudentAttendanceRecordDialog
                    open={open}
                    onOpenChange={handleCloseDialog}
                    attendee={selectedAttendee}
                    onUpdate={(data) => handleUpdate(data, selectedAttendee)}
                    submitting={submitting}
               />
          </ProtectedLayout>
     )
}
