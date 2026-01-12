"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
     Search,
     ChevronLeft,
     ChevronRight,
     ChevronsLeft,
     ChevronsRight,
     ChevronDown,
     FilePenLine,
     ChevronRight as ChevronRightIcon,
     UserX,
     Loader2,
} from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { AttendeesResponse } from "@/interface/attendance/records/management/AttendeesResponse"

interface GroupedAttendees {
     [key: string]: {
          groupName: string
          count: number
          attendees: AttendeesResponse[]
     }
}

interface EventAttendeesTableWithTabsProps {
     groupedAttendees: GroupedAttendees
     loading: boolean
     onOpenDialog: (attendee: AttendeesResponse) => void
}

const ITEMS_PER_PAGE = 20

export function EventAttendeesTable({
     groupedAttendees,
     loading,
     onOpenDialog,
}: EventAttendeesTableWithTabsProps) {
     const groups = Object.values(groupedAttendees)
     const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
          new Set(groups.slice(0, 1).map((g) => g.groupName))
     )
     const [searchTerm, setSearchTerm] = useState("")
     const [statusFilter, setStatusFilter] = useState<string>("ALL")
     const [currentPages, setCurrentPages] = useState<Record<string, number>>({})

     const toggleGroup = (groupName: string) => {
          setExpandedGroups((prev) => {
               const next = new Set(prev)
               if (next.has(groupName)) {
                    next.delete(groupName)
               } else {
                    next.add(groupName)
               }
               return next
          })
     }

     const expandAll = () => {
          setExpandedGroups(new Set(groups.map((g) => g.groupName)))
     }

     const collapseAll = () => {
          setExpandedGroups(new Set())
     }

     const getFullName = (attendee: AttendeesResponse) =>
          `${attendee.firstName} ${attendee.lastName}`

     const formatDate = (dateString: string | null): string => {
          if (!dateString) return "N/A"
          const date = new Date(dateString.replace(" ", "T") + ":00")
          return date.toLocaleString("en-US", {
               month: "short",
               day: "numeric",
               hour: "2-digit",
               minute: "2-digit",
               hour12: true,
          })
     }

     const getStatusCounts = (attendees: AttendeesResponse[]) => {
          const counts = {
               PRESENT: 0,
               ABSENT: 0,
               LATE: 0,
               EXCUSED: 0,
               REGISTERED: 0,
               PARTIALLY_REGISTERED: 0,
               IDLE: 0,
          }
          attendees.forEach((a) => {
               if (counts.hasOwnProperty(a.attendanceStatus)) {
                    counts[a.attendanceStatus as keyof typeof counts]++
               }
          })
          return counts
     }

     const getFilteredData = (group: (typeof groups)[0]) => {
          return group.attendees.filter((attendee) => {
               const matchesSearch =
                    getFullName(attendee).toLowerCase().includes(searchTerm.toLowerCase()) ||
                    attendee.reason?.toLowerCase().includes(searchTerm.toLowerCase())

               const matchesStatus =
                    statusFilter === "ALL" || attendee.attendanceStatus === statusFilter

               return matchesSearch && matchesStatus
          })
     }

     const allStatuses = useMemo(() => {
          const statuses = new Set<string>()
          groups.forEach((group) => {
               group.attendees.forEach((a) => statuses.add(a.attendanceStatus))
          })
          return Array.from(statuses).sort()
     }, [groups])

     if (loading) {
          return (
               <Empty>
                    <EmptyHeader>
                         <EmptyMedia variant="icon">
                              <Loader2 className="animate-spin" />
                         </EmptyMedia>
                         <EmptyTitle>Loading attendance data...</EmptyTitle>
                         <EmptyDescription>
                              Please wait while we fetch the attendance records.
                         </EmptyDescription>
                    </EmptyHeader>
               </Empty>
          )
     }

     if (groups.length === 0) {
          return (
               <Empty>
                    <EmptyHeader>
                         <EmptyMedia variant="icon">
                              <UserX />
                         </EmptyMedia>
                         <EmptyTitle>No attendance records found</EmptyTitle>
                         <EmptyDescription>
                              There are no attendance records available for this event yet.
                         </EmptyDescription>
                    </EmptyHeader>
               </Empty>
          )
     }

     return (
          <div className="space-y-4">
               {/*search and filters*/}
               <div className="flex flex-wrap gap-3 items-center print-hide">
                    <div className="relative flex-1 min-w-[200px]">
                         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                         <Input
                              placeholder="Search by name or reason..."
                              className="pl-8"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                         />
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
                    <div className="flex gap-2">
                         <Button variant="outline" size="sm" onClick={expandAll}>
                              Expand All
                         </Button>
                         <Button variant="outline" size="sm" onClick={collapseAll}>
                              Collapse All
                         </Button>
                    </div>
               </div>

               <div className="space-y-3">
                    {groups.map((group) => {
                         const isExpanded = expandedGroups.has(group.groupName)
                         const filteredData = getFilteredData(group)
                         const counts = getStatusCounts(group.attendees)
                         const currentPage = currentPages[group.groupName] || 1
                         const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
                         const paginatedData = filteredData.slice(
                              (currentPage - 1) * ITEMS_PER_PAGE,
                              currentPage * ITEMS_PER_PAGE
                         )

                         const setPageForGroup = (page: number) => {
                              setCurrentPages((prev) => ({ ...prev, [group.groupName]: page }))
                         }

                         return (
                              <div
                                   key={group.groupName}
                                   className="border rounded-lg overflow-hidden"
                                   data-accordion-item
                              >
                                   {/*header of grouped data*/}
                                   <button
                                        onClick={() => toggleGroup(group.groupName)}
                                        className="accordion-trigger w-full px-4 py-3 bg-muted hover:bg-muted/80 transition-colors flex items-center justify-between"
                                   >
                                        <div className="flex items-center gap-3">
                                             {isExpanded ? (
                                                  <ChevronDown className="h-5 w-5" />
                                             ) : (
                                                  <ChevronRightIcon className="h-5 w-5" />
                                             )}
                                             <span className="font-semibold text-lg">
                                                  {group.groupName}
                                             </span>
                                             <Badge variant="secondary">
                                                  {group.count} students
                                             </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                             <Badge variant="outline" className="bg-green-50">
                                                  <span className="text-green-700">
                                                       {counts.PRESENT} Present
                                                  </span>
                                             </Badge>
                                             <Badge variant="outline" className="bg-red-50">
                                                  <span className="text-red-700">
                                                       {counts.ABSENT} Absent
                                                  </span>
                                             </Badge>
                                             <Badge variant="outline" className="bg-yellow-50">
                                                  <span className="text-yellow-700">
                                                       {counts.LATE} Late
                                                  </span>
                                             </Badge>
                                        </div>
                                   </button>

                                   {/*grouped*/}
                                   {isExpanded && (
                                        <div className="p-4 space-y-4">
                                             {/*stats*/}
                                             <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                                  <div className="bg-muted/50 rounded p-2 text-center">
                                                       <div className="text-xl font-bold">
                                                            {group.count}
                                                       </div>
                                                       <div className="text-xs text-muted-foreground">
                                                            Total
                                                       </div>
                                                  </div>
                                                  <div className="bg-green-50 rounded p-2 text-center">
                                                       <div className="text-xl font-bold text-green-700">
                                                            {counts.PRESENT}
                                                       </div>
                                                       <div className="text-xs text-green-600">
                                                            Present
                                                       </div>
                                                  </div>
                                                  <div className="bg-red-50 rounded p-2 text-center">
                                                       <div className="text-xl font-bold text-red-700">
                                                            {counts.ABSENT}
                                                       </div>
                                                       <div className="text-xs text-red-600">
                                                            Absent
                                                       </div>
                                                  </div>
                                                  <div className="bg-yellow-50 rounded p-2 text-center">
                                                       <div className="text-xl font-bold text-yellow-700">
                                                            {counts.LATE}
                                                       </div>
                                                       <div className="text-xs text-yellow-600">
                                                            Late
                                                       </div>
                                                  </div>
                                                  <div className="bg-purple-50 rounded p-2 text-center">
                                                       <div className="text-xl font-bold text-purple-700">
                                                            {counts.EXCUSED}
                                                       </div>
                                                       <div className="text-xs text-purple-600">
                                                            Excused
                                                       </div>
                                                  </div>
                                                  <div className="bg-blue-50 rounded p-2 text-center">
                                                       <div className="text-xl font-bold text-blue-700">
                                                            {counts.REGISTERED}
                                                       </div>
                                                       <div className="text-xs text-blue-600">
                                                            Registered
                                                       </div>
                                                  </div>
                                                  <div className="bg-pink-50 rounded p-2 text-center">
                                                       <div className="text-xl font-bold text-pink-700">
                                                            {counts.PARTIALLY_REGISTERED}
                                                       </div>
                                                       <div className="text-xs text-pink-700">
                                                            Partially Registered
                                                       </div>
                                                  </div>
                                             </div>

                                             {/*results*/}
                                             <div className="text-sm text-muted-foreground print-hide">
                                                  Showing{" "}
                                                  {paginatedData.length > 0
                                                       ? (currentPage - 1) * ITEMS_PER_PAGE + 1
                                                       : 0}{" "}
                                                  to{" "}
                                                  {Math.min(
                                                       currentPage * ITEMS_PER_PAGE,
                                                       filteredData.length
                                                  )}{" "}
                                                  of {filteredData.length} results
                                             </div>

                                             {/* Table */}
                                             <div className="overflow-hidden">
                                                  {paginatedData.length === 0 ? (
                                                       <Empty>
                                                            <EmptyHeader>
                                                                 <EmptyMedia variant="icon">
                                                                      <UserX />
                                                                 </EmptyMedia>
                                                                 <EmptyTitle>
                                                                      No attendees found
                                                                 </EmptyTitle>
                                                                 <EmptyDescription>
                                                                      No attendees match your
                                                                      current search or filter
                                                                      criteria. Try adjusting your
                                                                      filters.
                                                                 </EmptyDescription>
                                                            </EmptyHeader>
                                                       </Empty>
                                                  ) : (
                                                       <Table>
                                                            <TableHeader>
                                                                 <TableRow>
                                                                      <TableHead className="w-[200px]">
                                                                           Name
                                                                      </TableHead>
                                                                      <TableHead>Status</TableHead>
                                                                      <TableHead className="hidden md:table-cell">
                                                                           Section
                                                                      </TableHead>
                                                                      <TableHead className="hidden lg:table-cell">
                                                                           Course
                                                                      </TableHead>
                                                                      <TableHead className="hidden xl:table-cell">
                                                                           Cluster
                                                                      </TableHead>
                                                                      <TableHead>Time In</TableHead>
                                                                      <TableHead>
                                                                           Time Out
                                                                      </TableHead>
                                                                      <TableHead className="hidden lg:table-cell">
                                                                           Reason
                                                                      </TableHead>
                                                                      <TableHead className="text-right print-hide">
                                                                           Update
                                                                      </TableHead>
                                                                 </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                 {paginatedData.map((attendee) => (
                                                                      <TableRow
                                                                           key={
                                                                                attendee.attendanceRecordId
                                                                           }
                                                                      >
                                                                           <TableCell>
                                                                                {getFullName(
                                                                                     attendee
                                                                                )}
                                                                           </TableCell>
                                                                           <TableCell>
                                                                                <span
                                                                                     className={cn(
                                                                                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset",
                                                                                          attendee.attendanceStatus ===
                                                                                               "PRESENT" &&
                                                                                               "bg-green-100 text-green-800 ring-green-600/20",
                                                                                          attendee.attendanceStatus ===
                                                                                               "ABSENT" &&
                                                                                               "bg-red-100 text-red-800 ring-red-600/20",
                                                                                          attendee.attendanceStatus ===
                                                                                               "REGISTERED" &&
                                                                                               "bg-blue-100 text-blue-800 ring-blue-600/20",
                                                                                          attendee.attendanceStatus ===
                                                                                               "PARTIALLY_REGISTERED" &&
                                                                                               "bg-pink-100 text-pink-800 ring-pink-600/20",
                                                                                          attendee.attendanceStatus ===
                                                                                               "IDLE" &&
                                                                                               "bg-gray-100 text-gray-800 ring-gray-600/20",
                                                                                          attendee.attendanceStatus ===
                                                                                               "LATE" &&
                                                                                               "bg-yellow-100 text-yellow-800 ring-yellow-600/20",
                                                                                          attendee.attendanceStatus ===
                                                                                               "EXCUSED" &&
                                                                                               "bg-purple-100 text-purple-800 ring-purple-600/20"
                                                                                     )}
                                                                                >
                                                                                     {
                                                                                          attendee.attendanceStatus
                                                                                     }
                                                                                </span>
                                                                           </TableCell>
                                                                           <TableCell className="hidden md:table-cell">
                                                                                {attendee.sectionName ||
                                                                                     "N/A"}
                                                                           </TableCell>
                                                                           <TableCell className="hidden lg:table-cell">
                                                                                {attendee.courseName ||
                                                                                     "N/A"}
                                                                           </TableCell>
                                                                           <TableCell className="hidden xl:table-cell">
                                                                                {attendee.clusterName ||
                                                                                     "N/A"}
                                                                           </TableCell>
                                                                           <TableCell>
                                                                                {formatDate(
                                                                                     attendee.timeIn
                                                                                )}
                                                                           </TableCell>
                                                                           <TableCell>
                                                                                {formatDate(
                                                                                     attendee.timeOut
                                                                                )}
                                                                           </TableCell>
                                                                           <TableCell className="hidden lg:table-cell max-w-[200px] truncate">
                                                                                {attendee.reason ||
                                                                                     "N/A"}
                                                                           </TableCell>
                                                                           <TableCell className="text-right print-hide">
                                                                                <Button
                                                                                     variant="ghost"
                                                                                     size="sm"
                                                                                     onClick={() =>
                                                                                          onOpenDialog(
                                                                                               attendee
                                                                                          )
                                                                                     }
                                                                                >
                                                                                     <FilePenLine className="h-5 w-5" />
                                                                                </Button>
                                                                           </TableCell>
                                                                      </TableRow>
                                                                 ))}
                                                            </TableBody>
                                                       </Table>
                                                  )}
                                             </div>

                                             {totalPages > 1 && (
                                                  <div className="flex items-center justify-between print-hide">
                                                       <div className="text-sm text-muted-foreground">
                                                            Page {currentPage} of {totalPages}
                                                       </div>
                                                       <div className="flex items-center gap-2">
                                                            <Button
                                                                 variant="outline"
                                                                 size="sm"
                                                                 onClick={() => setPageForGroup(1)}
                                                                 disabled={currentPage === 1}
                                                            >
                                                                 <ChevronsLeft className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                 variant="outline"
                                                                 size="sm"
                                                                 onClick={() =>
                                                                      setPageForGroup(
                                                                           Math.max(
                                                                                1,
                                                                                currentPage - 1
                                                                           )
                                                                      )
                                                                 }
                                                                 disabled={currentPage === 1}
                                                            >
                                                                 <ChevronLeft className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                 variant="outline"
                                                                 size="sm"
                                                                 onClick={() =>
                                                                      setPageForGroup(
                                                                           Math.min(
                                                                                totalPages,
                                                                                currentPage + 1
                                                                           )
                                                                      )
                                                                 }
                                                                 disabled={
                                                                      currentPage === totalPages
                                                                 }
                                                            >
                                                                 <ChevronRight className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                 variant="outline"
                                                                 size="sm"
                                                                 onClick={() =>
                                                                      setPageForGroup(totalPages)
                                                                 }
                                                                 disabled={
                                                                      currentPage === totalPages
                                                                 }
                                                            >
                                                                 <ChevronsRight className="h-4 w-4" />
                                                            </Button>
                                                       </div>
                                                  </div>
                                             )}
                                        </div>
                                   )}
                              </div>
                         )
                    })}
               </div>
          </div>
     )
}
