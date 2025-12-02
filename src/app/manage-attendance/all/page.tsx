"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Trash2 } from "lucide-react"
import Link from "next/link"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { AllAttendanceRecordsTable } from "@/components/manage-attendance/AllAttendanceRecordsTable"
import { useAllAttendanceRecords } from "@/hooks/attendance-records-management/useAllAttendanceRecords"
import { useDeleteAttendanceRecord } from "@/hooks/attendance-records-management/useDeleteAttendanceRecord"
import { useDeleteAllAttendanceRecords } from "@/hooks/attendance-records-management/useDeleteAllAttendanceRecords"
import {
     AlertDialog,
     AlertDialogAction,
     AlertDialogCancel,
     AlertDialogContent,
     AlertDialogDescription,
     AlertDialogFooter,
     AlertDialogHeader,
     AlertDialogTitle,
     AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import {
     Breadcrumb,
     BreadcrumbItem,
     BreadcrumbLink,
     BreadcrumbList,
     BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
export default function AllAttendanceRecordsManagementPage() {
     const { data: attendanceRecords, loading, error, refetch } = useAllAttendanceRecords()
     const {
          deleteRecord,
          pending: deletePending,
          error: deleteError,
     } = useDeleteAttendanceRecord(refetch)
     const {
          deleteAll,
          pending: deleteAllPending,
          error: deleteAllError,
     } = useDeleteAllAttendanceRecords(refetch)
     const [searchTerm, setSearchTerm] = useState("")
     const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
     const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)
     const [showDeleteDialog, setShowDeleteDialog] = useState(false)
     const filteredAttendanceRecords = (attendanceRecords ?? []).filter((record) => {
          const lowerSearch = searchTerm.trim().toLowerCase()
          const searchWords = lowerSearch.split(" ").filter((w) => w)
          const fields = [
               record.student?.user?.firstName || "",
               record.student?.user?.lastName || "",
               record.student?.studentNumber || "",
               record.event?.eventName || "",
               record.attendanceStatus?.toString() || "",
               record.reason || "",
               record.timeIn || "",
               record.timeOut || "",
          ]
          return searchWords.every((sw) =>
               fields.some((f) => (f?.toString().toLowerCase() || "").includes(sw))
          )
     })
     useEffect(() => {
          if (error) {
               toast.error(error.message || "An error occurred")
          }
          if (deleteError) {
               toast.error(deleteError.message || "An error occurred")
          }
          if (deleteAllError) {
               toast.error(deleteAllError.message || "An error occurred")
          }
     }, [error, deleteError, deleteAllError])
     const handleDeleteRecord = (recordId: string) => {
          setSelectedRecordId(recordId)
          setShowDeleteDialog(true)
     }
     const confirmDeleteRecord = async () => {
          if (selectedRecordId) {
               try {
                    await deleteRecord(selectedRecordId)
                    toast.success("Attendance record deleted successfully")
                    setShowDeleteDialog(false)
                    setSelectedRecordId(null)
               } catch (err) {
                    toast.error(`Failed to delete record: ${(err as Error).message}`)
               }
          }
     }
     const confirmDeleteAll = async () => {
          try {
               await deleteAll()
               toast.success("All attendance records deleted successfully")
               setShowDeleteAllDialog(false)
          } catch (err) {
               toast.error(`Failed to delete all records: ${(err as Error).message}`)
          }
     }
     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full h-full min-w-0 gap-6">
                    <div>
                         <Breadcrumb>
                              <BreadcrumbList>
                                   <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                             <Link href="/manage-attendance">
                                                  Manage Attendance
                                             </Link>
                                        </BreadcrumbLink>
                                   </BreadcrumbItem>
                                   <BreadcrumbSeparator />
                                   <BreadcrumbItem>
                                        <BreadcrumbLink>All Records</BreadcrumbLink>
                                   </BreadcrumbItem>
                              </BreadcrumbList>
                         </Breadcrumb>
                    </div>
                    <div className="space-y-2">
                         <h1 className="text-2xl font-bold md:text-3xl">
                              Manage All Attendance Records
                         </h1>
                         <p className="text-muted-foreground">
                              View, search, and manage all attendance records across events.
                         </p>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                         <div className="flex-1" />
                         <AlertDialog
                              open={showDeleteAllDialog}
                              onOpenChange={setShowDeleteAllDialog}
                         >
                              <AlertDialogTrigger asChild>
                                   <div>
                                        <Button
                                             variant="destructive"
                                             size="sm"
                                             disabled={deleteAllPending || loading}
                                             className="transition-transform duration-200"
                                        >
                                             <Trash2 className="w-4 h-4 mr-2" />
                                             Delete All Records
                                        </Button>
                                   </div>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                   <AlertDialogHeader>
                                        <AlertDialogTitle>
                                             Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                             This action cannot be undone. This will permanently
                                             delete all attendance records and remove them from our
                                             servers.
                                        </AlertDialogDescription>
                                   </AlertDialogHeader>
                                   <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                             onClick={confirmDeleteAll}
                                             disabled={deleteAllPending}
                                        >
                                             {deleteAllPending ? "Deleting..." : "Delete All"}
                                        </AlertDialogAction>
                                   </AlertDialogFooter>
                              </AlertDialogContent>
                         </AlertDialog>
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                         <div className="relative flex-1">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <div>
                                   <Input
                                        placeholder="Search records by student name, event, status..."
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
                                   onClick={() => refetch()}
                                   disabled={loading}
                                   className="transition-transform duration-200"
                              >
                                   Refresh
                              </Button>
                         </div>
                    </div>
                    <div>
                         <AllAttendanceRecordsTable
                              records={filteredAttendanceRecords}
                              loading={loading}
                              onDelete={handleDeleteRecord}
                              searchTerm={searchTerm}
                         />
                    </div>
                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                         <AlertDialogContent>
                              <AlertDialogHeader>
                                   <AlertDialogTitle>Delete Attendance Record?</AlertDialogTitle>
                                   <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete
                                        the selected attendance record.
                                   </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                   <AlertDialogCancel>Cancel</AlertDialogCancel>
                                   <AlertDialogAction
                                        onClick={confirmDeleteRecord}
                                        disabled={deletePending}
                                   >
                                        {deletePending ? "Deleting..." : "Delete Record"}
                                   </AlertDialogAction>
                              </AlertDialogFooter>
                         </AlertDialogContent>
                    </AlertDialog>
               </div>
          </ProtectedLayout>
     )
}
