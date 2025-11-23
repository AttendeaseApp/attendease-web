"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import UploadDropPart from "@/components/manage-users/UploadDropPart"
import { uploadStudentCSV } from "@/services/student-import-services"
import ImportStatusDialog from "@/components/manage-users/ImportStatusDialog"

interface ImportStudentsDialogProps {
     open: boolean
     onOpenChange: (open: boolean) => void
}

export default function ImportStudentsDialog({ open, onOpenChange }: ImportStudentsDialogProps) {
     const [selectedFile, setSelectedFile] = useState<File | null>(null)
     const [loading, setLoading] = useState(false)
     const [statusDialogOpen, setStatusDialogOpen] = useState(false)
     const [importStatus, setImportStatus] = useState<"success" | "error">("success")
     const [importMessage, setImportMessage] = useState("")


     const showStatus = (status: "success" | "error", message: string) => {
          setImportStatus(status)
          setImportMessage(message)
          setStatusDialogOpen(true)
     }

     const handleUpload = async () => {
          if (!selectedFile) return

          try {
               setLoading(true)
               const result = await uploadStudentCSV(selectedFile)
               setSelectedFile(result)

               showStatus("success", "CSV uploaded successfully.")
               onOpenChange(false)
          } catch (err) {
               showStatus("error", "Failed to upload CSV. File contains a duplicate student. " + err)
          } finally {
               setLoading(false)
          }
     }

     return (
          <>
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
                              <div className="flex items-center justify-end pt-2 gap-1">
                                   <Button variant="outline" onClick={() => onOpenChange(false)}>
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

               <ImportStatusDialog
                    open={statusDialogOpen}
                    status={importStatus}
                    message={importMessage}
                    onClose={() => setStatusDialogOpen(false)}
               />
          </>
     )
}
