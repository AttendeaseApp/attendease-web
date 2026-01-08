"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import { Power, PowerOff, Trash2, Edit, MoreHorizontal } from "lucide-react"
import { AcademicYear } from "@/services/api/academic/academic-year"

interface AcademicYearTableProps {
     academicYears: AcademicYear[]
     loading: boolean
     onEdit: (academicYear: AcademicYear) => void
     onDelete: (academicYear: AcademicYear) => void
     onActivate: (academicYear: AcademicYear) => void
     onDeactivate: (academicYear: AcademicYear) => void
}

export function AcademicYearTable({
     academicYears,
     loading,
     onEdit,
     onDelete,
     onActivate,
     onDeactivate,
}: AcademicYearTableProps) {
     const formatDate = (dateString: string) => {
          return new Date(dateString).toLocaleDateString("en-US", {
               year: "numeric",
               month: "short",
               day: "numeric",
          })
     }

     if (loading) {
          return (
               <div>
                    <div className="p-8 text-center text-muted-foreground">
                         Loading academic years...
                    </div>
               </div>
          )
     }

     if (academicYears.length === 0) {
          return (
               <div>
                    <div className="p-8 text-center text-muted-foreground">
                         No academic years found
                    </div>
               </div>
          )
     }

     return (
          <div>
               <Table>
                    <TableHeader>
                         <TableRow>
                              <TableHead>Academic Year</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>First Semester</TableHead>
                              <TableHead>Second Semester</TableHead>
                              <TableHead>Current Semester</TableHead>
                              <TableHead>Progress</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                         </TableRow>
                    </TableHeader>
                    <TableBody>
                         {academicYears.map((ay) => (
                              <TableRow key={ay.id}>
                                   <TableCell className="font-medium">
                                        {ay.academicYearName}
                                   </TableCell>
                                   <TableCell>
                                        <Badge variant={"outline"}>{ay.status}</Badge>
                                   </TableCell>
                                   <TableCell className="text-sm">
                                        <div>{formatDate(ay.firstSemester.startDate)}</div>
                                        <div className="text-muted-foreground">
                                             to {formatDate(ay.firstSemester.endDate)}
                                        </div>
                                   </TableCell>
                                   <TableCell className="text-sm">
                                        <div>{formatDate(ay.secondSemester.startDate)}</div>
                                        <div className="text-muted-foreground">
                                             to {formatDate(ay.secondSemester.endDate)}
                                        </div>
                                   </TableCell>
                                   <TableCell>
                                        {ay.currentSemester ? (
                                             <Badge variant="secondary">
                                                  {ay.currentSemester.name}
                                             </Badge>
                                        ) : (
                                             <span className="text-muted-foreground text-sm">
                                                  N/A
                                             </span>
                                        )}
                                   </TableCell>
                                   <TableCell>
                                        {ay.progressPercentage !== null ? (
                                             <div className="flex items-center gap-2">
                                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                                       <div
                                                            className="bg-black h-2 rounded-full transition-all"
                                                            style={{
                                                                 width: `${Math.min(ay.progressPercentage, 100)}%`,
                                                            }}
                                                       />
                                                  </div>
                                                  <span className="text-sm tabular-nums">
                                                       {ay.progressPercentage.toFixed(0)}%
                                                  </span>
                                             </div>
                                        ) : (
                                             <span className="text-muted-foreground text-sm">
                                                  N/A
                                             </span>
                                        )}
                                   </TableCell>
                                   <TableCell className="text-right">
                                        <DropdownMenu>
                                             <DropdownMenuTrigger asChild>
                                                  <Button variant="ghost" size="sm">
                                                       <MoreHorizontal className="h-4 w-4" />
                                                       <span className="sr-only">Open menu</span>
                                                  </Button>
                                             </DropdownMenuTrigger>
                                             <DropdownMenuContent align="end">
                                                  {/*edit */}
                                                  <DropdownMenuItem
                                                       onClick={() => onEdit(ay)}
                                                       disabled={ay.active}
                                                  >
                                                       <Edit className="mr-2 h-4 w-4" />
                                                       Edit
                                                  </DropdownMenuItem>

                                                  {/*activate/deactivate */}
                                                  {!ay.active ? (
                                                       <DropdownMenuItem
                                                            onClick={() => onActivate(ay)}
                                                       >
                                                            <Power className="mr-2 h-4 w-4" />
                                                            Activate
                                                       </DropdownMenuItem>
                                                  ) : (
                                                       <DropdownMenuItem
                                                            onClick={() => onDeactivate(ay)}
                                                       >
                                                            <PowerOff className="mr-2 h-4 w-4" />
                                                            Deactivate
                                                       </DropdownMenuItem>
                                                  )}

                                                  {/*delete*/}
                                                  {!ay.active && (
                                                       <>
                                                            <DropdownMenuItem
                                                                 onClick={() => onDelete(ay)}
                                                                 className="text-destructive focus:text-destructive"
                                                            >
                                                                 <Trash2 className="mr-2 h-4 w-4" />
                                                                 Delete
                                                            </DropdownMenuItem>
                                                       </>
                                                  )}
                                             </DropdownMenuContent>
                                        </DropdownMenu>
                                   </TableCell>
                              </TableRow>
                         ))}
                    </TableBody>
               </Table>
          </div>
     )
}
