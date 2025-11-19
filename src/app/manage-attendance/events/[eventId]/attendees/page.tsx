"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEventById } from "@/hooks/attendance-records-management/useEventById"
import { useEventAttendees } from "@/hooks/attendance-records-management/useEventAttendees"
import { EventAttendeesTable } from "@/components/manage-attendance/EventAttendeesTable"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { useRouter } from "next/navigation"

export default function EventAttendeesPage() {
     const params = useParams()
     const eventId = params.eventId as string
     const router = useRouter()

     const { data: event } = useEventById(eventId)

     const { data: attendeesResponse, loading, error } = useEventAttendees(eventId)

     const [searchTerm, setSearchTerm] = useState("")
     const [currentPage, setCurrentPage] = useState(1)
     const pageSize = 10

     const attendees = attendeesResponse?.attendees ?? []
     const totalAttendees = attendeesResponse?.totalAttendees ?? 0

     const handleSearchChange = (term: string) => {
          setSearchTerm(term)
          setCurrentPage(1)
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
                    <Button variant="outline" onClick={() => router.back()} className="w-fit">
                         ← Go Back
                    </Button>

                    <div className="space-y-2">
                         <h1 className="text-2xl font-bold">
                              Attendance Records for {event?.eventName || "Event"}
                         </h1>
                         {event && (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
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
                              <Button onClick={() => window.print()}>Print</Button>{" "}
                         </div>
                    </div>

                    <EventAttendeesTable
                         attendeesData={attendees}
                         totalAttendees={totalAttendees}
                         loading={loading}
                         eventId={eventId}
                         currentPage={currentPage}
                         pageSize={pageSize}
                         onPageChange={setCurrentPage}
                         searchTerm={searchTerm}
                         onSearchChange={handleSearchChange}
                    />
               </div>
          </ProtectedLayout>
     )
}
