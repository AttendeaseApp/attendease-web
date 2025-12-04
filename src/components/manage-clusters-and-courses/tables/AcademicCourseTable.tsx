"use client"
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
import { Course } from "@/interface/academic/course/CourseInterface"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import React, { useState } from "react"

interface CourseTableProps {
     courses: Course[]
     loading: boolean
     onEdit: (course: Course) => void
     onDelete: (course: Course) => Promise<void>
}

export function AcademicCourseTable({ courses, loading, onEdit, onDelete }: CourseTableProps) {
     const sortedCourses = [...courses].sort((a, b) => {
          const nameA = `${a.courseName} ${a.courseName}`.toLowerCase()
          const nameB = `${b.courseName} ${b.courseName}`.toLowerCase()

          if (nameA < nameB) return -1
          if (nameA > nameB) return 1
          return 0
     })

     const [deleteTarget, setDeleteTarget] = useState<Course | null>(null)
     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
     const handleEdit = (course: Course, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          onEdit(course)
     }
     const openDeleteDialog = (course: Course, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          setDeleteTarget(course)
          setDeleteDialogOpen(true)
     }
     const confirmDelete = async () => {
          if (deleteTarget) {
               try {
                    await onDelete(deleteTarget)
               } catch (err) {
                    console.error("Delete failed:", err)
               } finally {
                    setDeleteTarget(null)
                    setDeleteDialogOpen(false)
               }
          }
     }
     return (
          <>
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
                              sortedCourses.map((sortedCourses) => (
                                   <TableRow key={`${sortedCourses.id || "no-course"}`}>
                                        <TableCell>{sortedCourses.courseName || " –"}</TableCell>
                                        <TableCell>
                                             {sortedCourses.cluster?.clusterName || " –"}
                                        </TableCell>
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
                                                            onClick={(e) =>
                                                                 handleEdit(sortedCourses, e)
                                                            }
                                                       >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                       </DropdownMenuItem>

                                                       <DropdownMenuItem
                                                            onClick={(e) =>
                                                                 openDeleteDialog(sortedCourses, e)
                                                            }
                                                       >
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            Delete
                                                       </DropdownMenuItem>

                                                       <DropdownMenuSeparator />
                                                  </DropdownMenuContent>
                                             </DropdownMenu>
                                        </TableCell>
                                   </TableRow>
                              ))
                         )}
                    </TableBody>
               </Table>

               <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent className="sm:max-w-md">
                         <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                   Are you sure you want to delete the course{" "}
                                   <strong>{deleteTarget?.courseName}</strong>? This action cannot
                                   be undone.
                              </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>
          </>
     )
}
