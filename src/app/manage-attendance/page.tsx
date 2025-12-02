"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { AttendanceRecordsTable } from "@/components/manage-attendance/AttendanceRecordsTable"
import { useFinalizedEvents } from "@/hooks/attendance-records-management/useFinalizedEvent"
import { toast } from "sonner"

export default function AttendanceRecordsManagementPage() {
     const { data: attendanceRecords, loading, error, refetch: loadEvents } = useFinalizedEvents()
     const [searchTerm, setSearchTerm] = useState("")
     const filteredAttendanceRecords = (attendanceRecords ?? []).filter((event) => {
          const lowerSearch = searchTerm.trim().toLowerCase()
          const searchWords = lowerSearch.split(" ").filter((w) => w)
          const fields = [
               event.eventName,
               event.locationName,
               new Date(event.timeInRegistrationStartDateTime).toLocaleString(),
               new Date(event.startDateTime).toLocaleString(),
               new Date(event.endDateTime).toLocaleString(),
               event.totalPresent?.toString(),
               event.totalAbsent?.toString(),
               event.totalLate?.toString(),
          ]
          return searchWords.every((sw) =>
               fields.some((f) => (f?.toString().toLowerCase() || "").includes(sw))
          )
     })
     useEffect(() => {
          if (error) {
               toast.error(error.message)
          }
     }, [error])
     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full h-full min-w-0 gap-6">
                    <div className="space-y-2">
                         <h1 className="text-2xl font-bold md:text-3xl">
                              Manage Attendance Records
                         </h1>
                         <p className="text-muted-foreground">
                              View and manage finalized attendance records for events.
                         </p>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                         <div className="flex-1" />
                         <div>
                              <Link href="/manage-attendance/all">
                                   <Button
                                        variant="outline"
                                        size="sm"
                                        className="transition-transform duration-200"
                                   >
                                        View All Records
                                   </Button>
                              </Link>
                         </div>
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                         <div className="relative flex-1">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <div>
                                   <Input
                                        placeholder="Search events..."
                                        className="pl-8 transition-shadow duration-200 focus:shadow-lg"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                   />
                              </div>
                         </div>
                         <div>
                              <Button
                                   variant="outline"
                                   size="sm"
                                   onClick={() => loadEvents()}
                                   className="transition-transform duration-200"
                              >
                                   Refresh
                              </Button>
                         </div>
                    </div>
                    <div>
                         <AttendanceRecordsTable
                              events={filteredAttendanceRecords}
                              loading={loading}
                         />
                    </div>
               </div>
          </ProtectedLayout>
     )
}
