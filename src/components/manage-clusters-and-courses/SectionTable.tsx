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
import { Section } from "@/interface/cluster-and-course-interface"
interface SectionProps {
     sections: Section[]
     loading: boolean
     onDelete: (section: Section) => void
}
export function SectionTable({ sections, loading, onDelete }: SectionProps) {
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
                                        <Button
                                             variant="ghost"
                                             size="sm"
                                             onClick={(e) => handleDelete(section, e)}
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
