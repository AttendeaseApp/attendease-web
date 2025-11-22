"use client"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { EventAttendeesTable } from "@/components/manage-attendance/EventAttendeesTable"
import { UpdateStudentAttendanceRecordDialog } from "@/components/manage-attendance/UpdateStudentAttendanceRecordDialog"
import { Button } from "@/components/ui/button"
import { useEventAttendees } from "@/hooks/attendance-records-management/useEventAttendees"
import { useEventById } from "@/hooks/attendance-records-management/useEventById"
import { useUpdateAttendance } from "@/hooks/attendance-records-management/useUpdateStudentAttendanceStatus"
import { AttendeesResponse } from "@/interface/attendance/records/management/AttendeesResponse"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
export default function EventAttendeesPage() {
     const params = useParams()
     const eventId = params.eventId as string
     const router = useRouter()
     const [open, setOpen] = useState(false)
     const [selectedAttendee, setSelectedAttendee] = useState<AttendeesResponse | null>(null)
     const { data: event, loading: eventLoading } = useEventById(eventId)
     const { data: attendeesResponse, loading, error, refetch } = useEventAttendees(eventId)
     const [searchTerm, setSearchTerm] = useState("")
     const attendees = attendeesResponse?.attendees ?? []
     const totalAttendees = attendeesResponse?.totalAttendees ?? 0
     const { handleUpdate, submitting } = useUpdateAttendance(eventId, refetch)
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
                    <div className="p-4 text-center">Loading event details...</div>
               </ProtectedLayout>
          )
     }
     if (error) {
          return (
               <ProtectedLayout>
                    <div className="p-4 text-red-500">Error: {error.message}</div>
               </ProtectedLayout>
          )
     }
     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full h-full min-w-0 gap-6">
                    <Button variant="ghost" onClick={() => router.back()} className="w-fit">
                         ← Go Back
                    </Button>
                    <div className="space-y-2">
                         <h1 className="text-2xl font-bold">{event?.eventName || "Event"}</h1>
                         {event && (
                              <div className="flex flex-col">
                                   <div>
                                        <strong>Event Description:</strong>{" "}
                                        {event.description || "N/A"}
                                   </div>
                                   <div>
                                        <strong>Venue:</strong>{" "}
                                        {event.eventLocation?.locationName || "N/A"}
                                   </div>
                                   <div>
                                        <strong>Registration:</strong>{" "}
                                        {event.timeInRegistrationStartDateTime || "N/A"}
                                   </div>
                                   <div>
                                        <strong>Start:</strong> {event.startDateTime || "N/A"}
                                   </div>
                                   <div>
                                        <strong>End:</strong> {event.endDateTime || "N/A"}
                                   </div>
                              </div>
                         )}
                         <div className="flex justify-end">
                              <Button onClick={() => window.print()}>Print</Button>
                         </div>
                    </div>
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
