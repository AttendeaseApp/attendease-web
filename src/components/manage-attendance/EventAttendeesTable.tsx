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
     DropdownMenu,
     DropdownMenuTrigger,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { AttendeesResponse } from "@/interface/attendance/records/management/atendees-response-interface"

interface EventAttendeesTableProps {
     attendeesData: AttendeesResponse[]
     totalAttendees: number
     loading: boolean
     eventId: string
     currentPage: number
     pageSize?: number
     onPageChange: (page: number) => void
     searchTerm: string
     onSearchChange: (term: string) => void
}

export function EventAttendeesTable({
     attendeesData,
     loading,
     eventId,
     currentPage = 1,
     pageSize = 10,
     searchTerm,
     onSearchChange,
}: EventAttendeesTableProps) {
     const router = useRouter()

     const getFullName = (attendee: AttendeesResponse) =>
          `${attendee.firstName} ${attendee.lastName}`

     const filteredData = attendeesData.filter(
          (attendee) =>
               getFullName(attendee).toLowerCase().includes(searchTerm.toLowerCase()) ||
               attendee.reason?.toLowerCase().includes(searchTerm.toLowerCase())
     )

     const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

     return (
          <div className="space-y-4">
               <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                         placeholder="Search by name or reason..."
                         className="pl-8"
                         value={searchTerm}
                         onChange={(e) => onSearchChange(e.target.value)}
                    />
               </div>

               <Table>
                    <TableHeader>
                         <TableRow>
                              <TableHead>Full Name</TableHead>
                              <TableHead>Attendance Status</TableHead>
                              <TableHead>Cluster</TableHead>
                              <TableHead>Course</TableHead>
                              <TableHead>Time In</TableHead>
                              <TableHead>Reason</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                         </TableRow>
                    </TableHeader>
                    <TableBody>
                         {loading ? (
                              <TableRow>
                                   <TableCell colSpan={7} className="text-center py-8">
                                        Loading attendees...
                                   </TableCell>
                              </TableRow>
                         ) : paginatedData.length === 0 ? (
                              <TableRow>
                                   <TableCell colSpan={7} className="text-center py-8">
                                        No attendees found
                                   </TableCell>
                              </TableRow>
                         ) : (
                              paginatedData.map((attendee) => (
                                   <TableRow key={attendee.attendanceRecordId}>
                                        <TableCell className="font-medium">
                                             {getFullName(attendee)}
                                        </TableCell>
                                        <TableCell>
                                             {/* Fixed: Expanded badge to cover all AttendanceStatus values */}
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
                                        <TableCell>{attendee.section || "N/A"}</TableCell>{" "}
                                        <TableCell>{attendee.course || "N/A"}</TableCell>
                                        <TableCell>
                                             {new Date(attendee.timeIn).toLocaleString()}
                                        </TableCell>
                                        <TableCell>{attendee.reason || "N/A"}</TableCell>
                                        <TableCell className="text-right">
                                             <DropdownMenu>
                                                  <DropdownMenuTrigger asChild>
                                                       <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                 Open menu
                                                            </span>
                                                       </Button>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent align="end">
                                                       <DropdownMenuItem
                                                            onClick={() => {
                                                                 router.push(
                                                                      `/manage-attendance/${eventId}/update/${attendee.attendanceRecordId}`
                                                                 )
                                                            }}
                                                       >
                                                            View and Update
                                                       </DropdownMenuItem>
                                                       <DropdownMenuSeparator />
                                                       <DropdownMenuItem
                                                            onClick={() =>
                                                                 console.log(
                                                                      "Print record:",
                                                                      attendee.attendanceRecordId
                                                                 )
                                                            }
                                                       >
                                                            Print
                                                       </DropdownMenuItem>
                                                  </DropdownMenuContent>
                                             </DropdownMenu>
                                        </TableCell>
                                   </TableRow>
                              ))
                         )}
                    </TableBody>
               </Table>
          </div>
     )
}
