"use client"

import React from "react"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash } from "lucide-react"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { CourseSession } from "@/interface/cluster-and-course-interface"
interface CourseTableProps {
     courses: CourseSession[]
     loading: boolean
     onDelete: (course: CourseSession) => void
}
export function ClusterAndCourseTable({ courses, loading, onDelete }: CourseTableProps) {
     const handleDelete = (course: CourseSession, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          if (
               confirm(
                    `Are you sure you want to delete the course "${course.courseName}"? This action cannot be undone.`
               )
          ) {
               onDelete(course)
          }
     }
     return (
          <Table className="w-full">
               <TableHeader>
                    <TableRow>
                         <TableHead>COURSE</TableHead>
                         <TableHead>REFERENCED CLUSTER</TableHead>
                         <TableHead className="text-right"></TableHead>
                    </TableRow>
               </TableHeader>
               <TableBody>
                    {loading ? (
                         <TableRow>
                              <TableCell colSpan={3} className="text-center py-8">
                                   Loading courses and clusters...
                              </TableCell>
                         </TableRow>
                    ) : courses.length === 0 ? (
                         <TableRow>
                              <TableCell colSpan={3} className="text-center py-8">
                                   No courses and clusters found
                              </TableCell>
                         </TableRow>
                    ) : (
                         courses.map((course) => (
                              <TableRow key={`${course.id || "no-course"}`}>
                                   <TableCell>{course.courseName || " –"}</TableCell>
                                   <TableCell>{course.cluster?.clusterName || " –"}</TableCell>
                                   <TableCell className="text-right">
                                        <Button
                                             variant="ghost"
                                             size="sm"
                                             onClick={(e) => handleDelete(course, e)}
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
