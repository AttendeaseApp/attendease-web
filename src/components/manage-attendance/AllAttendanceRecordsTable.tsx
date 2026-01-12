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
          <Table>
               <TableHeader>
                    <TableRow>
                         <TableHead className="font-semibold text-gray-900">Name</TableHead>
                         <TableHead className="font-semibold text-gray-900">
                              Student Number
                         </TableHead>
                         <TableHead className="font-semibold text-gray-900">Event</TableHead>
                         <TableHead className="font-semibold text-gray-900">Status</TableHead>
                         <TableHead className="font-semibold text-gray-900">Reason</TableHead>
                         <TableHead className="font-semibold text-gray-900">Time In</TableHead>
                         <TableHead className="font-semibold text-gray-900">Time Out</TableHead>
                         <TableHead className="text-right font-semibold text-gray-900">
                              Actions
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
                                   <TableCell>
                                        {record.student?.user?.firstName || "N/A"}{" "}
                                        {record.student?.user?.lastName || ""}
                                   </TableCell>
                                   <TableCell>{record.student?.studentNumber || "N/A"}</TableCell>
                                   <TableCell>{record.event?.eventName || "N/A"}</TableCell>
                                   <TableCell>
                                        <span
                                             className={cn(
                                                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset whitespace-nowrap",
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
                                   <TableCell className="max-w-[200px]">
                                        <div className="truncate" title={record.reason || "-"}>
                                             {record.reason || "-"}
                                        </div>
                                   </TableCell>
                                   <TableCell className="whitespace-nowrap">
                                        {formatDate(record.timeIn)}
                                   </TableCell>
                                   <TableCell className="whitespace-nowrap">
                                        {formatDate(record.timeOut)}
                                   </TableCell>
                                   <TableCell className="text-right">
                                        <Button
                                             variant="ghost"
                                             size="sm"
                                             onClick={() => onDelete(record.recordId)}
                                             className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                             Delete
                                        </Button>
                                   </TableCell>
                              </TableRow>
                         ))
                    )}
               </TableBody>
          </Table>
     )
}
