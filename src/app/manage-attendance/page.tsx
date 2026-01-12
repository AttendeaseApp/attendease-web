"use client"

import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { AttendanceRecordsTable } from "@/components/manage-attendance/AttendanceRecordsTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select"
import {
     AcademicYear,
     getAllAcademicYears,
} from "@/services/api/academic/academic-year-management-service"
import { useFinalizedEvents } from "@/services/api/attendance/records/management/useFinalizedEvent"
import { useFinalizedEventsByAcademicYear } from "@/services/api/attendance/records/management/useFinalizedEventsByAcademicYear"
import { useFinalizedEventsBySemester } from "@/services/api/attendance/records/management/useFinalizedEventsBySemester"
import { Search, X, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function AttendanceRecordsManagementPage() {
     const [searchTerm, setSearchTerm] = useState("")
     const [academicYear, setAcademicYear] = useState<string>("")
     const [semester, setSemester] = useState<number | null>(null)
     const [academicYearOptions, setAcademicYearOptions] = useState<AcademicYear[]>([])

     useEffect(() => {
          const fetchAcademicYears = async () => {
               try {
                    const years = await getAllAcademicYears()
                    setAcademicYearOptions(years)
               } catch (error) {
                    const message =
                         error instanceof Error ? error.message : "Failed to load academic years"
                    toast.error("ERROR", {
                         description: message,
                    })
               }
          }
          fetchAcademicYears()
     }, [])

     const { data: allEvents, loading, error, refetch: loadEvents } = useFinalizedEvents()
     const { data: eventsByAcademicYear, refetch: loadByAcademicYear } =
          useFinalizedEventsByAcademicYear(academicYear)
     const { data: eventsBySemester, refetch: loadBySemester } = useFinalizedEventsBySemester(
          academicYear,
          semester || 0
     )

     const eventsToDisplay = semester
          ? (eventsBySemester ?? [])
          : academicYear
            ? (eventsByAcademicYear ?? [])
            : (allEvents ?? [])

     const filteredEvents = eventsToDisplay.filter((event) => {
          const lowerSearch = searchTerm.trim().toLowerCase()
          if (!lowerSearch) return true
          const searchWords = lowerSearch.split(" ").filter(Boolean)
          const fields = [
               event.eventName,
               event.registrationLocationName,
               event.venueLocationName,
               event.registrationDateTime,
               event.startingDateTime,
               event.endingDateTime,
               event.totalPresent?.toString(),
               event.totalAbsent?.toString(),
               event.totalLate?.toString(),
          ]
          return searchWords.every((sw) =>
               fields.some((f) => (f?.toString().toLowerCase() || "").includes(sw))
          )
     })

     useEffect(() => {
          if (error) toast.error(error.message)
     }, [error])

     useEffect(() => {
          if (academicYear) {
               setSemester(null)
               loadByAcademicYear()
          }
     }, [academicYear])

     useEffect(() => {
          if (academicYear && semester) loadBySemester()
     }, [academicYear, semester])

     const clearFilters = () => {
          setAcademicYear("")
          setSemester(null)
          setSearchTerm("")
          loadEvents()
     }

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

                    {/* Filters */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                         <div className="relative flex-1">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                   placeholder="Search events..."
                                   className="pl-8 transition-shadow duration-200 focus:shadow-lg"
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                              />
                         </div>

                         <div className="flex gap-2">
                              <Select
                                   value={academicYear}
                                   onValueChange={(val) => setAcademicYear(val)}
                              >
                                   <SelectTrigger>
                                        <SelectValue placeholder="Select Academic Year" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        {academicYearOptions.map((year) => (
                                             <SelectItem key={year.id} value={year.id}>
                                                  {year.academicYearName}
                                             </SelectItem>
                                        ))}
                                   </SelectContent>
                              </Select>

                              <Select
                                   value={semester?.toString() || ""}
                                   onValueChange={(val) => setSemester(Number(val))}
                                   disabled={!academicYear}
                              >
                                   <SelectTrigger>
                                        <SelectValue placeholder="Select Semester" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                   </SelectContent>
                              </Select>
                         </div>

                         <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 transition-transform duration-200"
                              onClick={clearFilters}
                         >
                              <X className="size-4" /> Clear Filters
                         </Button>

                         <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadEvents()}
                              className="transition-transform duration-200"
                         >
                              <RefreshCw className=" h-4 w-4" />
                         </Button>
                    </div>

                    <div>
                         <AttendanceRecordsTable events={filteredEvents} loading={loading} />
                    </div>
               </div>
          </ProtectedLayout>
     )
}
