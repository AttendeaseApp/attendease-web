"use client"
import { Button } from "@/components/ui/button"
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import { AttendanceRecords } from "@/interface/attendance/records/AttendanceRecords"

import { cn } from "@/lib/utils"
interface AllAttendanceRecordsTableProps {
     records: AttendanceRecords[]
     loading: boolean
     onDelete: (recordId: string) => void
     searchTerm?: string
}
export function AllAttendanceRecordsTable({
     records,
     loading,
     onDelete,
     searchTerm,
}: AllAttendanceRecordsTableProps) {
     const formatDate = (dateString: string | null): string => {
          if (!dateString) return "N/A"
          const date = new Date(dateString.replace(" ", "T") + ":00")
          return date.toLocaleString("en-US", {
               year: "numeric",
               month: "short",
               day: "numeric",
               hour: "2-digit",
               minute: "2-digit",
               hour12: true,
          })
     }

     return (
          <div>
               <Table>
                    <TableHeader className="bg-gray-100">
                         <TableRow>
                              <TableHead className="font-semibold text-gray-900 w-[200px]">
                                   STUDENT
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900 w-[150px]">
                                   STUDENT NUMBER
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900 w-[200px]">
                                   EVENT
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900 w-[120px]">
                                   STATUS
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900 w-[150px]">
                                   REASON
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900 w-[120px]">
                                   TIME IN
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900 w-[120px]">
                                   TIME OUT
                              </TableHead>
                              <TableHead className="text-right font-semibold text-gray-900 w-[100px]">
                                   DELETE
                              </TableHead>
                         </TableRow>
                    </TableHeader>
                    <TableBody>
                         {loading ? (
                              <TableRow>
                                   <TableCell colSpan={8} className="text-center py-8">
                                        Loading records...
                                   </TableCell>
                              </TableRow>
                         ) : records.length === 0 ? (
                              <TableRow>
                                   <TableCell colSpan={8} className="text-center py-8">
                                        No attendance records found
                                        {searchTerm ? ` for "${searchTerm}"` : ""}
                                   </TableCell>
                              </TableRow>
                         ) : (
                              records.map((record) => (
                                   <TableRow key={record.recordId}>
                                        <TableCell className="font-medium">
                                             {record.student?.user?.firstName || "N/A"}{" "}
                                             {record.student?.user?.lastName || ""}
                                        </TableCell>
                                        <TableCell>
                                             {record.student?.studentNumber || "N/A"}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                             {record.event?.eventName || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                             <span
                                                  className={cn(
                                                       "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset",
                                                       record.attendanceStatus === "PRESENT" &&
                                                            "bg-green-100 text-green-800 ring-green-600/20",
                                                       record.attendanceStatus === "ABSENT" &&
                                                            "bg-red-100 text-red-800 ring-red-600/20",
                                                       record.attendanceStatus === "REGISTERED" &&
                                                            "bg-blue-100 text-blue-800 ring-blue-600/20",
                                                       record.attendanceStatus === "IDLE" &&
                                                            "bg-gray-100 text-gray-800 ring-gray-600/20",
                                                       record.attendanceStatus === "LATE" &&
                                                            "bg-yellow-100 text-yellow-800 ring-yellow-600/20",
                                                       record.attendanceStatus === "EXCUSED" &&
                                                            "bg-purple-100 text-purple-800 ring-purple-600/20"
                                                  )}
                                             >
                                                  {record.attendanceStatus || "N/A"}
                                             </span>
                                        </TableCell>
                                        <TableCell className="max-w-[150px] truncate">
                                             {record.reason || "-"}
                                        </TableCell>
                                        <TableCell>{formatDate(record.timeIn) || "N/A"}</TableCell>
                                        <TableCell>{formatDate(record.timeIn) || "N/A"}</TableCell>
                                        <TableCell className="text-right">
                                             <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => onDelete(record.recordId)}
                                             >
                                                  Delete
                                             </Button>
                                        </TableCell>
                                   </TableRow>
                              ))
                         )}
                    </TableBody>
               </Table>
          </div>
     )
}
