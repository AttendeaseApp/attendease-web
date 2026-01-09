import { useState } from "react"
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
     createAcademicYear,
     CreateAcademicYearRequest,
} from "@/services/api/academic/academic-year"

interface CreateAcademicYearDialogProps {
     isOpen: boolean
     onClose: () => void
     onCreate: () => void
}

export function CreateAcademicYearDialog({
     isOpen,
     onClose,
     onCreate,
}: CreateAcademicYearDialogProps) {
     const [loading, setLoading] = useState(false)
     const [formData, setFormData] = useState<CreateAcademicYearRequest>({
          academicYearName: "",
          firstSemesterStart: "",
          firstSemesterEnd: "",
          secondSemesterStart: "",
          secondSemesterEnd: "",
     })

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          setLoading(true)

          try {
               await createAcademicYear(formData)
               onCreate()
               handleClose()
          } catch (err) {
               console.error("Failed to create academic year:", err)
          } finally {
               setLoading(false)
          }
     }

     const handleClose = () => {
          setFormData({
               academicYearName: "",
               firstSemesterStart: "",
               firstSemesterEnd: "",
               secondSemesterStart: "",
               secondSemesterEnd: "",
          })
          onClose()
     }

     return (
          <Dialog open={isOpen} onOpenChange={handleClose}>
               <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                         <DialogTitle>Create Academic Year</DialogTitle>
                         <DialogDescription>
                              Add a new academic year with first and second semester dates.
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
                                             required
                                        />
                                   </div>
                              </div>
                         </div>

                         <DialogFooter>
                              <Button type="button" variant="outline" onClick={handleClose}>
                                   Close
                              </Button>
                              <Button type="submit" disabled={loading}>
                                   {loading ? "Creating..." : "Create Academic Year"}
                              </Button>
                         </DialogFooter>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
