"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { AttendanceRecordsTable } from "@/components/manage-attendance/AttendanceRecordsTable"
import { useFinalizedEvents } from "@/hooks/attendance-records-management/useFinalizedEvent"

export default function AttendanceRecordsManagementPage() {
     const { data: attendanceRecords, loading, error, refetch: loadEvents } = useFinalizedEvents()
     const [searchTerm, setSearchTerm] = useState("")

     const filteredAttendanceRecords = (attendanceRecords ?? []).filter((event) =>
          event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
     )

     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full h-full min-w-0 gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                         <div>
                              <h1 className="text-2xl font-bold md:text-3xl">
                                   Manage Attendance Records
                              </h1>
                              <p className="text-muted-foreground mt-1">
                                   View and manage finalized attendance records for events.
                              </p>
                         </div>
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                         <div className="relative flex-1">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                   placeholder="Search events..."
                                   className="pl-8"
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                              />
                         </div>
                         <Button variant="outline" size="sm" onClick={() => loadEvents()}>
                              Refresh
                         </Button>
                    </div>
                    {error && (
                         <div className="mt-4 p-4 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                              {error.message}
                         </div>
                    )}
                    <AttendanceRecordsTable events={filteredAttendanceRecords} loading={loading} />
               </div>
          </ProtectedLayout>
     )
}
