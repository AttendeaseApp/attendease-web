"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select"
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import {
     AttendeesResponse,
     EventAttendeesResponse,
} from "@/interface/attendance/records/management/AttendeesResponse"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp, Clock, Loader2, Search, UserCheck, Users, X } from "lucide-react"
import { useMemo, useState } from "react"
import {
     Pagination,
     PaginationContent,
     PaginationItem,
     PaginationLink,
     PaginationNext,
     PaginationPrevious,
} from "@/components/ui/pagination"

interface AttendeesCardProps {
     attendeesData: EventAttendeesResponse
     eventName: string
     onClose: () => void
     loading?: boolean
     defaultExpanded?: boolean
}

export const AttendeesCard: React.FC<AttendeesCardProps> = ({
     attendeesData,
     eventName,
     onClose,
     loading = false,
     defaultExpanded = false,
}) => {
     const [searchTerm, setSearchTerm] = useState("")
     const [statusFilter, setStatusFilter] = useState<string>("ALL")
     const [isExpanded, setIsExpanded] = useState(defaultExpanded)

     const [currentPage, setCurrentPage] = useState(1)
     const perPage = 10

     const filteredAttendees = useMemo(() => {
          const filtered = attendeesData.attendees.filter((attendee) => {
               const fullName = `${attendee.firstName} ${attendee.lastName}`.toLowerCase()
               const matchesSearch = fullName.includes(searchTerm.toLowerCase())
               const matchesStatus =
                    statusFilter === "ALL" || attendee.attendanceStatus === statusFilter
               return matchesSearch && matchesStatus
          })
          setCurrentPage(1)
          return filtered
     }, [attendeesData.attendees, searchTerm, statusFilter])

     const totalPages = Math.ceil(filteredAttendees.length / perPage)

     const currentAttendees = filteredAttendees.slice(
          (currentPage - 1) * perPage,
          currentPage * perPage
     )

     const getStatusCounts = () => {
          const counts = {
               PRESENT: 0,
               LATE: 0,
               REGISTERED: 0,
               PARTIALLY_REGISTERED: 0,
          }
          attendeesData.attendees.forEach((a) => {
               if (counts.hasOwnProperty(a.attendanceStatus)) {
                    counts[a.attendanceStatus as keyof typeof counts]++
               }
          })
          return counts
     }

     const statusCounts = getStatusCounts()
     const allStatuses = Array.from(
          new Set(attendeesData.attendees.map((a) => a.attendanceStatus))
     ).sort()

     const formatDate = (dateString: string | null): string => {
          if (!dateString) return "N/A"
          try {
               const date = new Date(dateString.replace(" ", "T") + ":00")
               return date.toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
               })
          } catch {
               return dateString
          }
     }

     return (
          <div className="border rounded-lg overflow-hidden">
               <div className="bg-muted/50 border-b">
                    <div className="flex items-center justify-between p-4">
                         <div className="flex items-center gap-3">
                              <Button
                                   variant="ghost"
                                   size="icon"
                                   onClick={() => setIsExpanded(!isExpanded)}
                                   className="h-8 w-8"
                              >
                                   {isExpanded ? (
                                        <ChevronUp className="h-5 w-5" />
                                   ) : (
                                        <ChevronDown className="h-5 w-5" />
                                   )}
                              </Button>
                              <div>
                                   <h2 className="text-lg font-semibold">Registered Attendees</h2>
                                   <p className="text-sm text-muted-foreground">{eventName}</p>
                              </div>
                              <Badge variant="secondary" className="ml-2">
                                   {attendeesData.totalAttendees} attendees
                              </Badge>
                         </div>
                         <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                              <X className="h-4 w-4" />
                         </Button>
                    </div>
                    {isExpanded && (
                         <div className="grid grid-cols-2 md:grid-cols-6 gap-2 p-4 pt-0">
                              <div className="bg-background rounded p-2 text-center border">
                                   <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                                        <Users className="h-3 w-3" />
                                   </div>
                                   <div className="text-xl font-bold">
                                        {attendeesData.totalAttendees}
                                   </div>
                                   <div className="text-xs text-muted-foreground">Total</div>
                              </div>
                              <div className="bg-green-50 rounded p-2 text-center border border-green-200">
                                   <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                                        <UserCheck className="h-3 w-3" />
                                   </div>
                                   <div className="text-xl font-bold text-green-700">
                                        {statusCounts.PRESENT}
                                   </div>
                                   <div className="text-xs text-green-600">Present</div>
                              </div>
                              <div className="bg-yellow-50 rounded p-2 text-center border border-yellow-200">
                                   <div className="flex items-center justify-center gap-1 text-yellow-600 mb-1">
                                        <Clock className="h-3 w-3" />
                                   </div>
                                   <div className="text-xl font-bold text-yellow-700">
                                        {statusCounts.LATE}
                                   </div>
                                   <div className="text-xs text-yellow-600">Late</div>
                              </div>
                              <div className="bg-blue-50 rounded p-2 text-center border border-blue-200">
                                   <div className="text-xl font-bold text-blue-700">
                                        {statusCounts.REGISTERED}
                                   </div>
                                   <div className="text-xs text-blue-600">Registered</div>
                              </div>
                              <div className="bg-purple-50 rounded p-2 text-center border border-purple-200">
                                   <div className="text-xl font-bold text-purple-700">
                                        {statusCounts.PARTIALLY_REGISTERED}
                                   </div>
                                   <div className="text-xs text-purple-600">Partial</div>
                              </div>
                         </div>
                    )}
               </div>

               {isExpanded && (
                    <div className="p-4 space-y-4">
                         <div className="flex flex-col gap-3 md:flex-row md:items-center">
                              <div className="relative flex-1">
                                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                   <Input
                                        placeholder="Search by name..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                   />
                                   {searchTerm && (
                                        <Button
                                             variant="ghost"
                                             size="icon"
                                             className="absolute right-1 top-1 h-7 w-7"
                                             onClick={() => setSearchTerm("")}
                                        >
                                             <X className="h-4 w-4" />
                                        </Button>
                                   )}
                              </div>
                              <Select value={statusFilter} onValueChange={setStatusFilter}>
                                   <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by status" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        <SelectItem value="ALL">All Statuses</SelectItem>
                                        {allStatuses.map((status) => (
                                             <SelectItem key={status} value={status}>
                                                  {status}
                                             </SelectItem>
                                        ))}
                                   </SelectContent>
                              </Select>
                         </div>

                         <div className="text-sm text-muted-foreground">
                              Showing {currentAttendees.length} of {filteredAttendees.length}{" "}
                              filtered attendees
                         </div>

                         {loading ? (
                              <Empty>
                                   <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                             <Loader2 className="animate-spin" />
                                        </EmptyMedia>
                                        <EmptyTitle>Loading attendees...</EmptyTitle>
                                   </EmptyHeader>
                              </Empty>
                         ) : filteredAttendees.length === 0 ? (
                              <Empty>
                                   <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                             <Users />
                                        </EmptyMedia>
                                        <EmptyTitle>No attendees found</EmptyTitle>
                                        <EmptyDescription>
                                             No attendees match your current search or filter
                                             criteria.
                                        </EmptyDescription>
                                   </EmptyHeader>
                              </Empty>
                         ) : (
                              <div className="border rounded-lg overflow-hidden">
                                   <Table>
                                        <TableHeader>
                                             <TableRow>
                                                  <TableHead>Name</TableHead>
                                                  <TableHead className="hidden md:table-cell">
                                                       Section
                                                  </TableHead>
                                                  <TableHead className="hidden lg:table-cell">
                                                       Course
                                                  </TableHead>
                                                  <TableHead>Status</TableHead>
                                                  <TableHead>Time In</TableHead>
                                             </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                             {currentAttendees.map((a: AttendeesResponse) => (
                                                  <TableRow
                                                       key={a.attendanceRecordId}
                                                       className="hover:bg-muted/50"
                                                  >
                                                       <TableCell className="font-medium">
                                                            {a.firstName} {a.lastName}
                                                       </TableCell>
                                                       <TableCell className="hidden md:table-cell">
                                                            {a.sectionName || "N/A"}
                                                       </TableCell>
                                                       <TableCell className="hidden lg:table-cell">
                                                            {a.courseName || "N/A"}
                                                       </TableCell>
                                                       <TableCell>
                                                            <span
                                                                 className={cn(
                                                                      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset",
                                                                      a.attendanceStatus ===
                                                                           "PRESENT" &&
                                                                           "bg-green-100 text-green-800 ring-green-600/20",
                                                                      a.attendanceStatus ===
                                                                           "ABSENT" &&
                                                                           "bg-red-100 text-red-800 ring-red-600/20",
                                                                      a.attendanceStatus ===
                                                                           "REGISTERED" &&
                                                                           "bg-blue-100 text-blue-800 ring-blue-600/20",
                                                                      a.attendanceStatus ===
                                                                           "PARTIALLY_REGISTERED" &&
                                                                           "bg-purple-100 text-purple-800 ring-purple-600/20",
                                                                      a.attendanceStatus ===
                                                                           "IDLE" &&
                                                                           "bg-gray-100 text-gray-800 ring-gray-600/20",
                                                                      a.attendanceStatus ===
                                                                           "LATE" &&
                                                                           "bg-yellow-100 text-yellow-800 ring-yellow-600/20"
                                                                 )}
                                                            >
                                                                 {a.attendanceStatus}
                                                            </span>
                                                       </TableCell>
                                                       <TableCell className="text-sm">
                                                            {formatDate(a.timeIn)}
                                                       </TableCell>
                                                  </TableRow>
                                             ))}
                                        </TableBody>
                                   </Table>

                                   {/* PAGINATION */}
                                   {totalPages > 1 && (
                                        <div className="p-4">
                                             <Pagination>
                                                  <PaginationContent>
                                                       <PaginationItem>
                                                            <PaginationPrevious
                                                                 onClick={() =>
                                                                      setCurrentPage((p) => p - 1)
                                                                 }
                                                            />
                                                       </PaginationItem>

                                                       {Array.from({ length: totalPages }).map(
                                                            (_, idx) => (
                                                                 <PaginationItem key={idx}>
                                                                      <PaginationLink
                                                                           isActive={
                                                                                currentPage ===
                                                                                idx + 1
                                                                           }
                                                                           onClick={() =>
                                                                                setCurrentPage(
                                                                                     idx + 1
                                                                                )
                                                                           }
                                                                      >
                                                                           {idx + 1}
                                                                      </PaginationLink>
                                                                 </PaginationItem>
                                                            )
                                                       )}

                                                       <PaginationItem>
                                                            <PaginationNext
                                                                 onClick={() =>
                                                                      setCurrentPage((p) => p + 1)
                                                                 }
                                                            />
                                                       </PaginationItem>
                                                  </PaginationContent>
                                             </Pagination>
                                        </div>
                                   )}
                              </div>
                         )}
                    </div>
               )}
          </div>
     )
}
