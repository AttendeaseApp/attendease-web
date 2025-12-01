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
import {
     DropdownMenu,
     DropdownMenuTrigger,
     DropdownMenuContent,
     DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash, Pencil } from "lucide-react"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { Section } from "@/interface/cluster-and-course-interface"
interface SectionProps {
     sections: Section[]
     loading: boolean
     onEdit: (section: Section) => void
     onDelete: (section: Section) => void
}
export function SectionTable({ sections, loading, onEdit, onDelete }: SectionProps) {
     const handleEdit = (section: Section, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          onEdit(section)
     }
     const handleDelete = (section: Section, e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          if (
               confirm(
                    `Are you sure you want to delete the section "${section.name}"? This action cannot be undone.`
               )
          ) {
               onDelete(section)
          }
     }
     return (
          <Table className="w-full">
               <TableHeader>
                    <TableRow>
                         <TableHead>SECTION</TableHead>
                         <TableHead>REFERENCED COURSE</TableHead>
                         <TableHead className="text-right"></TableHead>
                    </TableRow>
               </TableHeader>
               <TableBody>
                    {loading ? (
                         <TableRow>
                              <TableCell colSpan={2} className="text-center py-8">
                                   Loading sections and courses...
                              </TableCell>
                         </TableRow>
                    ) : sections.length === 0 ? (
                         <TableRow>
                              <TableCell colSpan={2} className="text-center py-8">
                                   No sections and courses found
                              </TableCell>
                         </TableRow>
                    ) : (
                         sections.map((section) => (
                              <TableRow key={`${section.id || "no-course"}`}>
                                   <TableCell>{section.name || " –"}</TableCell>
                                   <TableCell>{section.course?.courseName || " –"}</TableCell>
                                   <TableCell className="text-right">
                                        <DropdownMenu>
                                             <DropdownMenuTrigger asChild>
                                                  <Button variant="ghost" size="sm">
                                                       <MoreHorizontal className="h-4 w-4" />
                                                       <span className="sr-only">Open menu</span>
                                                  </Button>
                                             </DropdownMenuTrigger>
                                             <DropdownMenuContent align="end">
                                                  <DropdownMenuItem
                                                       onClick={(e) => handleEdit(section, e)}
                                                  >
                                                       <Pencil className="mr-2 h-4 w-4" />
                                                       Edit
                                                  </DropdownMenuItem>
                                                  <DropdownMenuItem
                                                       onClick={(e) => handleDelete(section, e)}
                                                  >
                                                       <Trash className="mr-2 h-4 w-4" />
                                                       Delete
                                                  </DropdownMenuItem>
                                                  <DropdownMenuSeparator />
                                             </DropdownMenuContent>
                                        </DropdownMenu>
                                        {/* <Button
                                             variant="ghost"
                                             size="sm"
                                             onClick={(e) => handleDelete(section, e)}
                                        >
                                             Delete
                                        </Button> */}
                                   </TableCell>
                              </TableRow>
                         ))
                    )}
               </TableBody>
          </Table>
     )
}
