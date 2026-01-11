"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select"
import { AttendeesResponse } from "@/interface/attendance/records/management/AttendeesResponse"

interface EventAttendeesTableProps {
     attendeesData: AttendeesResponse[]
     totalAttendees: number
     loading: boolean
     eventId: string
     searchTerm: string
     statusFilter: string
     onSearchChange: (term: string) => void
     onStatusFilterChange: (status: string) => void
     onOpenDialog: (attendee: AttendeesResponse) => void
}

export function EventAttendeesTable({
     attendeesData,
     loading,
     searchTerm,
     statusFilter,
     onSearchChange,
     onStatusFilterChange,
     onOpenDialog,
}: EventAttendeesTableProps) {
     const getFullName = (attendee: AttendeesResponse) =>
          `${attendee.firstName} ${attendee.lastName}`

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

     const uniqueStatuses = Array.from(new Set(attendeesData.map((a) => a.attendanceStatus))).sort()
     const filteredData = attendeesData.filter((attendee) => {
          const matchesSearch =
               getFullName(attendee).toLowerCase().includes(searchTerm.toLowerCase()) ||
               attendee.reason?.toLowerCase().includes(searchTerm.toLowerCase())

          const matchesStatus = statusFilter === "ALL" || attendee.attendanceStatus === statusFilter

          return matchesSearch && matchesStatus
     })

     return (
          <div className="space-y-4">
               <div className="print-hide flex gap-3">
                    <div className="relative flex-1">
                         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                         <Input
                              placeholder="Search by name or reason..."
                              className="pl-8"
                              value={searchTerm}
                              onChange={(e) => onSearchChange(e.target.value)}
                         />
                    </div>
                    <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                         <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Filter by status" />
                         </SelectTrigger>
                         <SelectContent>
                              <SelectItem value="ALL">All Statuses</SelectItem>
                              {uniqueStatuses.map((status) => (
                                   <SelectItem key={status} value={status}>
                                        {status}
                                   </SelectItem>
                              ))}
                         </SelectContent>
                    </Select>
               </div>

               <Table>
                    <TableHeader>
                         <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Attendance Status</TableHead>
                              <TableHead>Section</TableHead>
                              <TableHead>Course</TableHead>
                              <TableHead>Cluster</TableHead>
                              <TableHead>Time In</TableHead>
                              <TableHead>Time Out</TableHead>
                              <TableHead>Reason</TableHead>
                              <TableHead className="print-hide text-right"></TableHead>
                         </TableRow>
                    </TableHeader>
                    <TableBody>
                         {loading ? (
                              <TableRow>
                                   <TableCell colSpan={9} className="text-center py-8">
                                        Loading attendees...
                                   </TableCell>
                              </TableRow>
                         ) : filteredData.length === 0 ? (
                              <TableRow>
                                   <TableCell colSpan={9} className="text-center py-8">
                                        No attendees found
                                   </TableCell>
                              </TableRow>
                         ) : (
                              filteredData.map((attendee) => (
                                   <TableRow key={attendee.attendanceRecordId}>
                                        <TableCell className="font-medium">
                                             {getFullName(attendee)}
                                        </TableCell>
                                        <TableCell>
                                             <span
                                                  className={cn(
                                                       "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset",
                                                       attendee.attendanceStatus === "PRESENT" &&
                                                            "bg-green-100 text-green-800 ring-green-600/20",
                                                       attendee.attendanceStatus === "ABSENT" &&
                                                            "bg-red-100 text-red-800 ring-red-600/20",
                                                       attendee.attendanceStatus === "REGISTERED" &&
                                                            "bg-blue-100 text-blue-800 ring-blue-600/20",
                                                       attendee.attendanceStatus === "IDLE" &&
                                                            "bg-gray-100 text-gray-800 ring-gray-600/20",
                                                       attendee.attendanceStatus === "LATE" &&
                                                            "bg-yellow-100 text-yellow-800 ring-yellow-600/20",
                                                       attendee.attendanceStatus === "EXCUSED" &&
                                                            "bg-purple-100 text-purple-800 ring-purple-600/20"
                                                  )}
                                             >
                                                  {attendee.attendanceStatus}
                                             </span>
                                        </TableCell>
                                        <TableCell>{attendee.sectionName || "N/A"}</TableCell>
                                        <TableCell>{attendee.courseName || "N/A"}</TableCell>
                                        <TableCell>{attendee.clusterName || "N/A"}</TableCell>
                                        <TableCell>{formatDate(attendee.timeIn)}</TableCell>
                                        <TableCell>{formatDate(attendee.timeOut)}</TableCell>
                                        <TableCell>{attendee.reason || "N/A"}</TableCell>
                                        <TableCell className="print-hide text-right">
                                             <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => onOpenDialog(attendee)}
                                             >
                                                  Edit
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
