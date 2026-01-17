"use client"

import UploadDropPart from "@/components/manage-users/dialogs/importStudent/UploadDropPart"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { importCSVResult } from "@/constants/import-stud-intrfac"
import { useState } from "react"

import {
     AlertDialog,
     AlertDialogAction,
     AlertDialogDescription,
     AlertDialogFooter,
     AlertDialogHeader,
     AlertDialogTitle,
     AlertDialogContent,
} from "@/components/ui/alert-dialog"

import { uploadStudentCSV } from "@/services/api/user/management/account/student-import-services"

interface ImportStudentsDialogProps {
     open: boolean
     onOpenChange: (open: boolean) => void
}

export default function ImportStudentsDialog({ open, onOpenChange }: ImportStudentsDialogProps) {
     const [selectedFile, setSelectedFile] = useState<File | null>(null)
     const [loading, setLoading] = useState(false)

     const [statusDialogOpen, setStatusDialogOpen] = useState(false)
     const [errorMessage, setErrorMessage] = useState("")

     const showResult = (message: string) => {
          setErrorMessage(message)
          setStatusDialogOpen(true)
     }

     const handleUpload = async () => {
          if (!selectedFile) return

          try {
               setLoading(true)
               const result: importCSVResult = await uploadStudentCSV(selectedFile)

               let message = result.message || "Import completed successfully.\n"

               if (result.summary) {
                    message += `Total Rows: ${result.summary.totalRows}\n`
                    message += `Successful: ${result.summary.successfulRows}\n`
                    message += `Failed: ${result.summary.failedRows}\n\n`

                    if (result.summary.missingSections?.length) {
                         message +=
                              "Missing Sections:\n" +
                              result.summary.missingSections.map((s) => `- ${s}`).join("\n") +
                              "\n\n"
                    }

                    if (result.summary.duplicateStudentNumbers?.length) {
                         message +=
                              "Duplicate Student Numbers:\n" +
                              result.summary.duplicateStudentNumbers
                                   .map((s) => `- ${s}`)
                                   .join("\n") +
                              "\n\n"
                    }
               }

               if (result.details?.length) {
                    message +=
                         "Row-specific Errors:\n" +
                         result.details
                              .map((d) => `Row ${d.row}: ${d.errors.join(", ")}`)
                              .join("\n")
               }

               showResult(message)
               setSelectedFile(null)
               onOpenChange(false)
          } catch (err) {
               if (err && typeof err === "object" && "summary" in err && "details" in err) {
                    const csvErr = err as importCSVResult
                    let message = csvErr.message || "CSV import failed.\n"

                    if (csvErr.summary) {
                         message += `Total Rows: ${csvErr.summary.totalRows}\n`
                         message += `Successful: ${csvErr.summary.successfulRows}\n`
                         message += `Failed: ${csvErr.summary.failedRows}\n\n`

                         if (csvErr.summary.missingSections?.length) {
                              message +=
                                   "Missing Sections:\n" +
                                   csvErr.summary.missingSections.map((s) => `- ${s}`).join("\n") +
                                   "\n\n"
                         }

                         if (csvErr.summary.duplicateStudentNumbers?.length) {
                              message +=
                                   "Duplicate Student Numbers:\n" +
                                   csvErr.summary.duplicateStudentNumbers
                                        .map((s) => `- ${s}`)
                                        .join("\n") +
                                   "\n\n"
                         }
                    }

                    if (csvErr.details?.length) {
                         message +=
                              "Row-specific Errors:\n" +
                              csvErr.details
                                   .map((d) => `Row ${d.row}: ${d.errors.join(", ")}`)
                                   .join("\n")
                    }

                    showResult(message)
               } else if (err instanceof Error) {
                    showResult(err.message)
               } else {
                    showResult(JSON.stringify(err))
               }
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

               <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                    <AlertDialogContent className="sm:max-w-md">
                         <AlertDialogHeader>
                              <AlertDialogTitle>Import Result</AlertDialogTitle>
                              <AlertDialogDescription className="text-sm text-muted-foreground whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
                                   {errorMessage}
                              </AlertDialogDescription>
                         </AlertDialogHeader>

                         <AlertDialogFooter>
                              <AlertDialogAction onClick={() => setStatusDialogOpen(false)}>
                                   OK
                              </AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>
          </>
     )
}
