"use client"

import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { EventAttendeesTable } from "@/components/manage-attendance/EventAttendeesTable"
import { UpdateStudentAttendanceRecordDialog } from "@/components/manage-attendance/UpdateStudentAttendanceRecordDialog"
import { Button } from "@/components/ui/button"
import { useEventById } from "@/services/api/event/useEventById"
import { useUpdateAttendance } from "@/services/api/attendance/records/management/useUpdateStudentAttendanceStatus"
import { AttendeesResponse } from "@/interface/attendance/records/management/AttendeesResponse"
import { useParams } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
import {
     Breadcrumb,
     BreadcrumbItem,
     BreadcrumbLink,
     BreadcrumbList,
     BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useSortedEventAttendees } from "@/services/api/attendance/records/management/useSortedEventAttendees"
import { AttendanceSortCriteria } from "@/interface/enums/attendance/AttendanceSortCriteria"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, Clock, FileText } from "lucide-react"
import Link from "next/link"

export default function EventAttendeesPage() {
     const params = useParams()
     const eventId = params.eventId as string
     const [open, setOpen] = useState(false)
     const [selectedAttendee, setSelectedAttendee] = useState<AttendeesResponse | null>(null)
     const { data: event, loading: eventLoading } = useEventById(eventId)
     const [sortBy, setSortBy] = useState<AttendanceSortCriteria>(AttendanceSortCriteria.SECTION)
     const { data: sortedData, loading, error, refetch } = useSortedEventAttendees(eventId, sortBy)

     const { handleUpdate, submitting } = useUpdateAttendance(eventId, refetch)

     useEffect(() => {
          if (error) {
               toast.error(error.message)
          }
     }, [error])

     const stats = useMemo(() => {
          if (!sortedData) return null
          const allAttendees = Object.values(sortedData.groupedAttendees).flatMap(
               (group) => group.attendees
          )
          const total = allAttendees.length
          const present = allAttendees.filter((a) => a.attendanceStatus === "PRESENT").length
          const absent = allAttendees.filter((a) => a.attendanceStatus === "ABSENT").length
          const late = allAttendees.filter((a) => a.attendanceStatus === "LATE").length
          const excused = allAttendees.filter((a) => a.attendanceStatus === "EXCUSED").length
          return { total, present, absent, late, excused }
     }, [sortedData])

     const handleOpenDialog = (attendee: AttendeesResponse) => {
          setSelectedAttendee(attendee)
          setOpen(true)
     }

     const handleCloseDialog = () => {
          setOpen(false)
          setSelectedAttendee(null)
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
                         @page {
                              size: landscape;
                              margin: 0.5cm;
                         }

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

                         aside,
                         nav[aria-label="breadcrumb"],
                         .print-hide {
                              display: none !important;
                         }

                         .print-layout {
                              max-width: 100% !important;
                              margin: 0 !important;
                              padding: 10px !important;
                         }

                         h1 {
                              font-size: 18px !important;
                              margin-bottom: 8px !important;
                         }

                         .event-info-grid {
                              font-size: 9px !important;
                              padding: 8px !important;
                              gap: 8px !important;
                         }

                         .event-description {
                              font-size: 8px !important;
                              line-height: 1.2 !important;
                              max-height: 40px !important;
                              overflow: hidden !important;
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

                         <div id="print-content" className="print-layout space-y-6">
                              {event && (
                                   <div className="space-y-3">
                                        <div>
                                             <h1 className="text-2xl md:text-3xl font-semibold">
                                                  {event.eventName}
                                             </h1>
                                             <p className="text-sm text-muted-foreground mt-1">
                                                  {event.description || "No description provided"}
                                             </p>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border rounded-lg p-4">
                                             <div>
                                                  <p className="text-muted-foreground text-xs">
                                                       Academic Year
                                                  </p>
                                                  <p className="font-medium">
                                                       {event.academicYearName || "N/A"}
                                                  </p>
                                             </div>
                                             <div>
                                                  <p className="text-muted-foreground text-xs">
                                                       Semester
                                                  </p>
                                                  <p className="font-medium">
                                                       {event.semesterName || "N/A"}
                                                  </p>
                                             </div>
                                             <div>
                                                  <p className="text-muted-foreground text-xs">
                                                       Registration Locations
                                                  </p>
                                                  <p className="font-medium">
                                                       {event.registrationLocationName || "N/A"}
                                                  </p>
                                             </div>
                                             <div>
                                                  <p className="text-muted-foreground text-xs">
                                                       Event Venue
                                                  </p>
                                                  <p className="font-medium">
                                                       {event.venueLocationName || "N/A"}
                                                  </p>
                                             </div>
                                             <div>
                                                  <p className="text-muted-foreground text-xs">
                                                       Registration Time
                                                  </p>
                                                  <p className="font-medium">
                                                       {event.registrationDateTime || "N/A"}
                                                  </p>
                                             </div>
                                             <div>
                                                  <p className="text-muted-foreground text-xs">
                                                       Start Time
                                                  </p>
                                                  <p className="font-medium">
                                                       {event.startingDateTime || "N/A"}
                                                  </p>
                                             </div>
                                             <div>
                                                  <p className="text-muted-foreground text-xs">
                                                       End Time
                                                  </p>
                                                  <p className="font-medium">
                                                       {event.endingDateTime || "N/A"}
                                                  </p>
                                             </div>
                                             <div className="print-hide flex items-end">
                                                  <Button
                                                       onClick={() => window.print()}
                                                       className="w-full"
                                                       variant="outline"
                                                       size="sm"
                                                  >
                                                       Print
                                                  </Button>
                                             </div>
                                        </div>
                                   </div>
                              )}

                              {stats && (
                                   <div className="print-hide grid gap-3 md:grid-cols-5">
                                        <Card>
                                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                                                  <CardTitle className="text-xs font-medium">
                                                       Total Attendees
                                                  </CardTitle>
                                                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                             </CardHeader>
                                             <CardContent className="px-4 pb-4">
                                                  <div className="text-xl font-bold">
                                                       {stats.total}
                                                  </div>
                                             </CardContent>
                                        </Card>
                                        <Card>
                                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                                                  <CardTitle className="text-xs font-medium">
                                                       Present
                                                  </CardTitle>
                                                  <UserCheck className="h-3.5 w-3.5 text-green-600" />
                                             </CardHeader>
                                             <CardContent className="px-4 pb-4">
                                                  <div className="text-xl font-bold text-green-600">
                                                       {stats.present}
                                                  </div>
                                                  <p className="text-[10px] text-muted-foreground">
                                                       {(
                                                            (stats.present / stats.total) *
                                                            100
                                                       ).toFixed(1)}
                                                       %
                                                  </p>
                                             </CardContent>
                                        </Card>
                                        <Card>
                                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                                                  <CardTitle className="text-xs font-medium">
                                                       Absent
                                                  </CardTitle>
                                                  <UserX className="h-3.5 w-3.5 text-red-600" />
                                             </CardHeader>
                                             <CardContent className="px-4 pb-4">
                                                  <div className="text-xl font-bold text-red-600">
                                                       {stats.absent}
                                                  </div>
                                                  <p className="text-[10px] text-muted-foreground">
                                                       {(
                                                            (stats.absent / stats.total) *
                                                            100
                                                       ).toFixed(1)}
                                                       %
                                                  </p>
                                             </CardContent>
                                        </Card>
                                        <Card>
                                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                                                  <CardTitle className="text-xs font-medium">
                                                       Late
                                                  </CardTitle>
                                                  <Clock className="h-3.5 w-3.5 text-yellow-600" />
                                             </CardHeader>
                                             <CardContent className="px-4 pb-4">
                                                  <div className="text-xl font-bold text-yellow-600">
                                                       {stats.late}
                                                  </div>
                                                  <p className="text-[10px] text-muted-foreground">
                                                       {((stats.late / stats.total) * 100).toFixed(
                                                            1
                                                       )}
                                                       %
                                                  </p>
                                             </CardContent>
                                        </Card>
                                        <Card>
                                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                                                  <CardTitle className="text-xs font-medium">
                                                       Excused
                                                  </CardTitle>
                                                  <FileText className="h-3.5 w-3.5 text-purple-600" />
                                             </CardHeader>
                                             <CardContent className="px-4 pb-4">
                                                  <div className="text-xl font-bold text-purple-600">
                                                       {stats.excused}
                                                  </div>
                                                  <p className="text-[10px] text-muted-foreground">
                                                       {(
                                                            (stats.excused / stats.total) *
                                                            100
                                                       ).toFixed(1)}
                                                       %
                                                  </p>
                                             </CardContent>
                                        </Card>
                                   </div>
                              )}

                              <div className="space-y-4">
                                   <div className="flex items-center justify-between">
                                        <div>
                                             <h2 className="text-xl font-semibold">
                                                  Attendance Records
                                             </h2>
                                             <p className="text-sm text-muted-foreground">
                                                  View and manage student attendance
                                             </p>
                                        </div>
                                        <Select
                                             value={sortBy}
                                             onValueChange={(v) =>
                                                  setSortBy(v as AttendanceSortCriteria)
                                             }
                                        >
                                             <SelectTrigger className="w-[180px]">
                                                  <SelectValue placeholder="Group by" />
                                             </SelectTrigger>
                                             <SelectContent>
                                                  <SelectItem
                                                       value={AttendanceSortCriteria.SECTION}
                                                  >
                                                       By Section
                                                  </SelectItem>
                                                  <SelectItem value={AttendanceSortCriteria.COURSE}>
                                                       By Course
                                                  </SelectItem>
                                                  <SelectItem
                                                       value={AttendanceSortCriteria.CLUSTER}
                                                  >
                                                       By Cluster
                                                  </SelectItem>
                                                  <SelectItem
                                                       value={AttendanceSortCriteria.YEAR_LEVEL}
                                                  >
                                                       By Year Level
                                                  </SelectItem>
                                             </SelectContent>
                                        </Select>
                                   </div>
                                   <div>
                                        {sortedData && (
                                             <EventAttendeesTable
                                                  groupedAttendees={sortedData.groupedAttendees}
                                                  loading={loading}
                                                  onOpenDialog={handleOpenDialog}
                                             />
                                        )}
                                   </div>
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
