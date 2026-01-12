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
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
     AcademicYear,
     getAllAcademicYears,
} from "@/services/api/academic/academic-year-management-service"
import { useFinalizedEvents } from "@/services/api/attendance/records/management/useFinalizedEvent"
import { useFinalizedEventsByAcademicYear } from "@/services/api/attendance/records/management/useFinalizedEventsByAcademicYear"
import { useFinalizedEventsBySemester } from "@/services/api/attendance/records/management/useFinalizedEventsBySemester"
import { useDeleteAllAttendanceRecords } from "@/services/api/attendance/records/management/useDeleteAllAttendanceRecords"
import { useDeleteAttendanceRecordsByAcademicYear } from "@/services/api/attendance/records/management/useDeleteAttendanceRecordsByAcademicYear"
import { Search, X, RefreshCw, Settings, Trash2, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type DeleteAction = "all" | "academic-year" | null

export default function AttendanceRecordsManagementPage() {
     const [searchTerm, setSearchTerm] = useState("")
     const [academicYear, setAcademicYear] = useState<string>("")
     const [semester, setSemester] = useState<number | null>(null)
     const [academicYearOptions, setAcademicYearOptions] = useState<AcademicYear[]>([])
     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
     const [deleteAction, setDeleteAction] = useState<DeleteAction>(null)
     const [selectedAcademicYearForDelete, setSelectedAcademicYearForDelete] = useState<string>("")

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

     const { deleteAll, pending: deletingAll } = useDeleteAllAttendanceRecords(loadEvents)
     const { deleteByAcademicYear, pending: deletingByYear } =
          useDeleteAttendanceRecordsByAcademicYear(loadEvents)

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

     const handleDeleteAllClick = () => {
          setDeleteAction("all")
          setDeleteDialogOpen(true)
     }

     const handleDeleteByAcademicYearClick = () => {
          setDeleteAction("academic-year")
          setSelectedAcademicYearForDelete("")
          setDeleteDialogOpen(true)
     }

     const handleConfirmDelete = async () => {
          try {
               if (deleteAction === "all") {
                    await deleteAll()
                    toast.success("All attendance records deleted successfully")
               } else if (deleteAction === "academic-year" && selectedAcademicYearForDelete) {
                    await deleteByAcademicYear(selectedAcademicYearForDelete)
               }
          } catch (error) {
               const message = error instanceof Error ? error.message : "Failed to delete records"
               toast.error("ERROR", { description: message })
          } finally {
               setDeleteDialogOpen(false)
               setDeleteAction(null)
               setSelectedAcademicYearForDelete("")
          }
     }

     const getDeleteDialogContent = () => {
          if (deleteAction === "all") {
               return {
                    title: "Delete All Attendance Records",
                    description:
                         "This will permanently delete ALL attendance records from the system. This action cannot be undone. Are you absolutely sure?",
               }
          }
          return {
               title: "Delete Attendance Records by Academic Year",
               description:
                    "This will permanently delete all attendance records for the selected academic year. This action cannot be undone.",
          }
     }

     const dialogContent = getDeleteDialogContent()
     const isDeleting = deletingAll || deletingByYear

     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full h-full min-w-0 gap-6">
                    <div className="flex items-start justify-between">
                         <div className="space-y-1">
                              <h1 className="text-2xl font-semibold md:text-3xl">
                                   Manage Attendance Records
                              </h1>
                              <p className="text-sm text-muted-foreground">
                                   View and manage finalized attendance records for events.
                              </p>
                         </div>

                         <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                   <Button variant="outline" size="sm">
                                        <Settings className="h-4 w-4 mr-2" />
                                        Settings
                                   </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56">
                                   <DropdownMenuLabel className="text-xs text-muted-foreground">
                                        System Settings
                                   </DropdownMenuLabel>
                                   <DropdownMenuSeparator />
                                   <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                        onClick={handleDeleteByAcademicYearClick}
                                   >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete by Academic Year
                                   </DropdownMenuItem>
                                   <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                        onClick={handleDeleteAllClick}
                                   >
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                        Delete All Records
                                   </DropdownMenuItem>
                              </DropdownMenuContent>
                         </DropdownMenu>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                         <div className="relative flex-1">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                   placeholder="Search events..."
                                   className="pl-8"
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                              />
                         </div>

                         <div className="flex gap-2">
                              <Select
                                   value={academicYear}
                                   onValueChange={(val) => setAcademicYear(val)}
                              >
                                   <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Academic Year" />
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
                                   <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Semester" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        <SelectItem value="1">Semester 1</SelectItem>
                                        <SelectItem value="2">Semester 2</SelectItem>
                                   </SelectContent>
                              </Select>

                              <Button
                                   variant="outline"
                                   size="icon"
                                   onClick={clearFilters}
                                   title="Clear Filters"
                              >
                                   <X className="h-4 w-4" />
                              </Button>

                              <Button
                                   variant="outline"
                                   size="icon"
                                   onClick={() => loadEvents()}
                                   title="Refresh"
                              >
                                   <RefreshCw className="h-4 w-4" />
                              </Button>
                         </div>
                    </div>

                    <div>
                         <AttendanceRecordsTable events={filteredEvents} loading={loading} />
                    </div>
               </div>

               <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                         <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                   <AlertTriangle className="h-5 w-5 text-red-600" />
                                   {dialogContent.title}
                              </AlertDialogTitle>
                              <AlertDialogDescription className="space-y-2">
                                   <p>{dialogContent.description}</p>
                                   <p className="text-sm bg-blue-50 border border-blue-200 rounded p-3 text-blue-900">
                                        <strong>Note:</strong> After removing attendance records,
                                        the events themselves will still remain in the system. If
                                        you wish to remove the events, you will need to delete them
                                        manually.
                                   </p>
                              </AlertDialogDescription>
                         </AlertDialogHeader>

                         {deleteAction === "academic-year" && (
                              <div className="my-4">
                                   <Select
                                        value={selectedAcademicYearForDelete}
                                        onValueChange={setSelectedAcademicYearForDelete}
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
                              </div>
                         )}

                         <AlertDialogFooter>
                              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                   onClick={handleConfirmDelete}
                                   disabled={
                                        isDeleting ||
                                        (deleteAction === "academic-year" &&
                                             !selectedAcademicYearForDelete)
                                   }
                                   className="bg-red-600 hover:bg-red-700"
                              >
                                   {isDeleting ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>
          </ProtectedLayout>
     )
}
