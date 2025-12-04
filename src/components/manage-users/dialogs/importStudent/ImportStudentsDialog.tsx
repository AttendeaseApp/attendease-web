"use client"

import UploadDropPart from "@/components/manage-users/dialogs/importStudent/UploadDropPart"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { uploadStudentCSV } from "@/services/api/user/management/import/student-import-services"
import { useState } from "react"
import { toast } from "sonner"

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

               const jsonResult = typeof result === "string" ? JSON.parse(result) : result

               let message = jsonResult.message || "Upload completed."
               if (
                    jsonResult.details &&
                    Array.isArray(jsonResult.details) &&
                    jsonResult.details.length > 0
               ) {
                    message += "\n\nErrors per row:\n"
                    jsonResult.details.forEach((item: { row: number; errors: string[] }) => {
                         message += `Row ${item.row}: ${item.errors.join(", ")}\n`
                    })
               }

               toast.info(message)

               setSelectedFile(null)
               onOpenChange(false)
          } catch (err) {
               const message =
                    err instanceof Error && err.message
                         ? err.message
                         : "Error occurred on uploading file"
               toast.error(`Error: ${message}`)
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
                              <p>Upload important students details via CSV</p>
                         </DialogHeader>

                         <form className="space-y-6">
                              <UploadDropPart onFileSelect={setSelectedFile} />

                              {selectedFile && (
                                   <p className="text-sm text-muted-foreground mt-2 text-center">
                                        Selected file:{" "}
                                        <span className="font-medium">{selectedFile.name}</span>
                                   </p>
                              )}

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
          </>
     )
}
