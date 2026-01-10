import { Button } from "@/components/ui/button"
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
     AcademicYear,
     updateAcademicYear,
     UpdateAcademicYearRequest,
} from "@/services/api/academic/academic-year"
import { useEffect, useState } from "react"

interface UpdateAcademicYearDialogProps {
     academicYear: AcademicYear
     isOpen: boolean
     onClose: () => void
     onUpdate: () => void
}

export function UpdateAcademicYearDialog({
     academicYear,
     isOpen,
     onClose,
     onUpdate,
}: UpdateAcademicYearDialogProps) {
     const [loading, setLoading] = useState(false)
     const [formData, setFormData] = useState<UpdateAcademicYearRequest>({
          academicYearName: "",
          firstSemesterStart: "",
          firstSemesterEnd: "",
          secondSemesterStart: "",
          secondSemesterEnd: "",
     })

     useEffect(() => {
          if (academicYear) {
               setFormData({
                    academicYearName: academicYear.academicYearName,
                    firstSemesterStart: academicYear.firstSemester.startDate.split("T")[0],
                    firstSemesterEnd: academicYear.firstSemester.endDate.split("T")[0],
                    secondSemesterStart: academicYear.secondSemester.startDate.split("T")[0],
                    secondSemesterEnd: academicYear.secondSemester.endDate.split("T")[0],
               })
          }
     }, [academicYear])

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          setLoading(true)

          try {
               await updateAcademicYear(academicYear.id, formData)
               onUpdate()
               onClose()
          } catch (err) {
               console.error("Failed to update academic year:", err)
          } finally {
               setLoading(false)
          }
     }

     return (
          <Dialog open={isOpen} onOpenChange={onClose}>
               <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                         <DialogTitle>Update Academic Year</DialogTitle>
                         <DialogDescription>
                              Edit the academic year details and semester dates.
                         </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                         {/* Academic Year Name */}
                         <div className="space-y-2">
                              <Label htmlFor="academicYearName">Academic Year Name *</Label>
                              <Input
                                   id="academicYearName"
                                   placeholder="e.g., 2024-2025"
                                   value={formData.academicYearName}
                                   onChange={(e) =>
                                        setFormData({
                                             ...formData,
                                             academicYearName: e.target.value,
                                        })
                                   }
                                   disabled={loading}
                                   required
                              />
                         </div>

                         {/* First Semester */}
                         <div className="space-y-4">
                              <h3 className="text-sm font-semibold">First Semester</h3>
                              <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                        <Label htmlFor="firstSemesterStartDate">Start Date *</Label>
                                        <Input
                                             id="firstSemesterStartDate"
                                             type="date"
                                             value={formData.firstSemesterStart}
                                             onChange={(e) =>
                                                  setFormData({
                                                       ...formData,
                                                       firstSemesterStart: e.target.value,
                                                  })
                                             }
                                             disabled={loading}
                                             required
                                        />
                                   </div>
                                   <div className="space-y-2">
                                        <Label htmlFor="firstSemesterEndDate">End Date *</Label>
                                        <Input
                                             id="firstSemesterEndDate"
                                             type="date"
                                             value={formData.firstSemesterEnd}
                                             onChange={(e) =>
                                                  setFormData({
                                                       ...formData,
                                                       firstSemesterEnd: e.target.value,
                                                  })
                                             }
                                             disabled={loading}
                                             required
                                        />
                                   </div>
                              </div>
                         </div>

                         {/* Second Semester */}
                         <div className="space-y-4">
                              <h3 className="text-sm font-semibold">Second Semester</h3>
                              <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                        <Label htmlFor="secondSemesterStartDate">
                                             Start Date *
                                        </Label>
                                        <Input
                                             id="secondSemesterStartDate"
                                             type="date"
                                             value={formData.secondSemesterStart}
                                             onChange={(e) =>
                                                  setFormData({
                                                       ...formData,
                                                       secondSemesterStart: e.target.value,
                                                  })
                                             }
                                             disabled={loading}
                                             required
                                        />
                                   </div>
                                   <div className="space-y-2">
                                        <Label htmlFor="secondSemesterEndDate">End Date *</Label>
                                        <Input
                                             id="secondSemesterEndDate"
                                             type="date"
                                             value={formData.secondSemesterEnd}
                                             onChange={(e) =>
                                                  setFormData({
                                                       ...formData,
                                                       secondSemesterEnd: e.target.value,
                                                  })
                                             }
                                             disabled={loading}
                                             required
                                        />
                                   </div>
                              </div>
                         </div>

                         <DialogFooter>
                              <Button
                                   type="button"
                                   variant="outline"
                                   onClick={onClose}
                                   disabled={loading}
                              >
                                   Close
                              </Button>
                              <Button type="submit" disabled={loading}>
                                   {loading ? "Updating..." : "Update Academic Year"}
                              </Button>
                         </DialogFooter>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
