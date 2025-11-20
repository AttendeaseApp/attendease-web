"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import UploadDropPart from "@/components/manage-users/UploadDropPart"
import { uploadStudentCSV } from "@/services/student-import-services"

interface ImportStudentsDialogProps {
     open: boolean
     onOpenChange: (open: boolean) => void
}

export default function ImportStudentsDialog({ open, onOpenChange }: ImportStudentsDialogProps) {
     const [selectedFile, setSelectedFile] = useState<File | null>(null)
     const [loading, setLoading] = useState(false)

     const handleUpload = async () => {
          if (!selectedFile) return
          try {
               setLoading(true)
               const result = await uploadStudentCSV(selectedFile)
               setSelectedFile(result)
               alert("CSV uploaded successfully")
               onOpenChange(false)
          } catch (err) {
               alert("Failed to upload CSV file")
          } finally {
               setLoading(false)
          }
     }

     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent className="sm:max-w-lg p-8">
                    <DialogHeader>
                         <DialogTitle>Import Student Accounts</DialogTitle>
                         <p>Upload important students details via CSV or Excel</p>
                    </DialogHeader>

                    <form className="space-y-6">
                         <UploadDropPart onFileSelect={setSelectedFile} />

                         {selectedFile && (
                              <p className="text-sm text-muted-foreground mt-2 text-center">
                                   Selected file:{" "}
                                   <span className="font-medium">{selectedFile.name}</span>
                              </p>
                         )}

                         {/* cancl and upload button */}
                         <div className="flex items-center justify-between pt-2">
                              <Button variant="outline" onClick={() => onOpenChange(false)}>
                                   {" "}
                                   Cancel
                              </Button>

                              <Button
                                   type="button"
                                   onClick={handleUpload}
                                   disabled={!selectedFile || loading}
                              >
                                   {loading ? "Uploading..." : "Upload"}
                              </Button>
                         </div>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
