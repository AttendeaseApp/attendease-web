"use client"

import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { EventAttendeesTable } from "@/components/manage-attendance/EventAttendeesTable"
import { UpdateStudentAttendanceRecordDialog } from "@/components/manage-attendance/UpdateStudentAttendanceRecordDialog"
import { Button } from "@/components/ui/button"
import { useEventAttendees } from "@/services/api/attendance/records/management/useEventAttendees"
import { useEventById } from "@/services/api/event/useEventById"
import { useUpdateAttendance } from "@/services/api/attendance/records/management/useUpdateStudentAttendanceStatus"
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
     const [statusFilter, setStatusFilter] = useState<string>("ALL")
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

     const handleStatusFilterChange = (status: string) => {
          setStatusFilter(status)
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
          <>
               <style jsx global>{`
                    @media print {
                         /* Force landscape orientation */
                         @page {
                              size: landscape;
                              margin: 0.5cm;
                         }

                         /* Hide everything except the main content */
                         body * {
                              visibility: hidden;
                         }

                         #print-content,
                         #print-content * {
                              visibility: visible;
                         }

                         #print-content {
                              position: absolute;
                              left: 0;
                              top: 0;
                              width: 100%;
                         }

                         /* Hide sidebar, breadcrumb, and print button */
                         aside,
                         nav[aria-label="breadcrumb"],
                         .print-hide {
                              display: none !important;
                         }

                         /* Adjust layout for print */
                         .print-layout {
                              max-width: 100% !important;
                              margin: 0 !important;
                              padding: 10px !important;
                         }

                         /* Compact title */
                         h1 {
                              font-size: 18px !important;
                              margin-bottom: 8px !important;
                         }

                         /* Make event info grid more compact */
                         .event-info-grid {
                              font-size: 9px !important;
                              padding: 8px !important;
                              gap: 8px !important;
                         }

                         /* Make description text much smaller for print */
                         .event-description {
                              font-size: 8px !important;
                              line-height: 1.2 !important;
                              max-height: 40px !important;
                              overflow: hidden !important;
                         }

                         .event-description strong {
                              font-size: 9px !important;
                         }

                         /* Compact other fields */
                         .event-info-grid > div {
                              line-height: 1.3 !important;
                         }

                         .event-info-grid strong {
                              font-size: 9px !important;
                         }
                    }
               `}</style>

               <ProtectedLayout>
                    <div key={eventId} className="flex flex-col w-full h-full min-w-0 gap-6">
                         <div className="print-hide">
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

                         <div id="print-content" className="print-layout space-y-4">
                              {event && (
                                   <div className="event-info-grid grid grid-cols-2 md:grid-cols-4 gap-3  text-xs">
                                        <h1 className="text-2xl font-bold md:text-3xl">
                                             {event?.eventName || "Event"}
                                        </h1>
                                        <div className="col-span-2 md:col-span-4">
                                             <strong className="text-xs">Description:</strong>
                                             <div className="event-description mt-1 max-h-16 overflow-y-auto text-xs leading-tight">
                                                  {event.description || "N/A"}
                                             </div>
                                        </div>
                                        <div>
                                             <strong className="text-xs">A.Y.</strong>
                                             <div className="text-xs">
                                                  {event.academicYearName || "N/A"}
                                             </div>
                                        </div>
                                        <div>
                                             <strong className="text-xs">Semester</strong>
                                             <div className="text-xs">
                                                  {event.semesterName || "N/A"}
                                             </div>
                                        </div>
                                        <div>
                                             <strong className="text-xs">
                                                  Registration Venue:
                                             </strong>
                                             <div className="text-xs">
                                                  {event.registrationLocationName || "N/A"}
                                             </div>
                                        </div>
                                        <div>
                                             <strong className="text-xs">Event Venue:</strong>
                                             <div className="text-xs">
                                                  {event.venueLocationName || "N/A"}
                                             </div>
                                        </div>
                                        <div>
                                             <strong className="text-xs">Registration:</strong>
                                             <div className="text-xs">
                                                  {event.registrationDateTime || "N/A"}
                                             </div>
                                        </div>
                                        <div>
                                             <strong className="text-xs">Start:</strong>
                                             <div className="text-xs">
                                                  {event.startingDateTime || "N/A"}
                                             </div>
                                        </div>
                                        <div>
                                             <strong className="text-xs">End:</strong>
                                             <div className="text-xs">
                                                  {event.endingDateTime || "N/A"}
                                             </div>
                                        </div>
                                        <div className="print-hide flex justify-end col-span-2 md:col-span-4">
                                             <Button
                                                  onClick={() => window.print()}
                                                  className="transition-all duration-200"
                                             >
                                                  Print
                                             </Button>
                                        </div>
                                   </div>
                              )}

                              <div>
                                   <EventAttendeesTable
                                        attendeesData={attendees}
                                        totalAttendees={totalAttendees}
                                        loading={loading}
                                        eventId={eventId}
                                        searchTerm={searchTerm}
                                        statusFilter={statusFilter}
                                        onSearchChange={handleSearchChange}
                                        onStatusFilterChange={handleStatusFilterChange}
                                        onOpenDialog={handleOpenDialog}
                                   />
                              </div>
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
          </>
     )
}
