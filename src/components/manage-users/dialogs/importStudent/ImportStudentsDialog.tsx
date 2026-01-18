"use client"

import UploadDropPart from "@/components/manage-users/dialogs/importStudent/UploadDropPart"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { importCSVResult } from "@/interface/students/import-stud-interface"
import { useState } from "react"
import { AlertTriangle, CircleCheck } from "lucide-react"
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
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface ImportStudentsDialogProps {
     open: boolean
     onOpenChange: (open: boolean) => void
}

export default function ImportStudentsDialog({ open, onOpenChange }: ImportStudentsDialogProps) {
     const [selectedFile, setSelectedFile] = useState<File | null>(null)
     const [loading, setLoading] = useState(false)

     const [statusDialogOpen, setStatusDialogOpen] = useState(false)
     const [errorMessage, setErrorMessage] = useState("")
     const [summary, setSummary] = useState<importCSVResult["summary"] | null>(null)
     const [details, setDetails] = useState<importCSVResult["details"] | null>(null)
     const [messageType, setMessageType] = useState<"success" | "error">("success")

     const showResult = (message: string, type: "success" | "error" = "success") => {
          setErrorMessage(message)
          setMessageType(type)
          setStatusDialogOpen(true)
     }

     const handleUpload = async () => {
          if (!selectedFile) return

          try {
               setLoading(true)
               const result: importCSVResult = await uploadStudentCSV(selectedFile)
               setSummary(result.summary ?? null)
               setDetails(result.details ?? null)

               let message = result.message || "Import completed successfully.\n"
               showResult(message, "success")
          } catch (err) {
               setSummary(null)
               setDetails(null)
               if (err && typeof err === "object" && "summary" in err && "details" in err) {
                    const csvErr = err as importCSVResult
                    setSummary(csvErr.summary ?? null)
                    setDetails(csvErr.details ?? null)
                    let message = "CSV import interrupted.\n"

                    showResult(message, "error")
               } else if (err instanceof Error) {
                    showResult(err.message, "error")
               } else {
                    showResult(JSON.stringify(err), "error")
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
                    <AlertDialogContent className="bg-muted border-accent">
                         <AlertDialogHeader>
                              <AlertDialogTitle className="text-2xl">
                                   Import Result
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-sm text-muted-foreground whitespace-pre-wrap wrap-break-words max-h-60 overflow-y-auto">
                                   {errorMessage && (
                                        <p
                                             className={`flex items-center gap-2 ${
                                                  messageType === "success"
                                                       ? "text-green-600"
                                                       : "text-orange-600"
                                             }`}
                                        >
                                             {messageType === "success" ? (
                                                  <CircleCheck className="h-5 w-5" />
                                             ) : (
                                                  <AlertTriangle className="h5 w-5" />
                                             )}
                                             <span>{errorMessage}</span>
                                        </p>
                                   )}
                                   {summary && (
                                        <>
                                             <div className="grid grid-cols-3 gap-4 rounded-lg p-3">
                                                  <div>
                                                       <p className="text-lg text-black">
                                                            Total Rows:
                                                            <strong>{summary.totalRows}</strong>
                                                       </p>
                                                  </div>
                                                  <div>
                                                       <p className="text-lg text-black">
                                                            Successful:
                                                            <strong>
                                                                 {summary.successfulRows}
                                                            </strong>
                                                       </p>
                                                  </div>
                                                  <div>
                                                       <p className="text-lg text-black">
                                                            Failed:
                                                            <strong>{summary.failedRows}</strong>
                                                       </p>
                                                  </div>
                                             </div>
                                             {details && details.length > 0 && (
                                                  <Card className="mt-4 mb-4 relative w-full p-3">
                                                       <div className="mt-2">
                                                            <p className="font-semibold text-lg">
                                                                 Row-specific Error:
                                                            </p>
                                                            <ul className="list-disc pl-3 text-sm">
                                                                 {details.map((d) => (
                                                                      <li key={d.row}>
                                                                           Row ${d.row}: $
                                                                           {d.errors.join(", ")}
                                                                      </li>
                                                                 ))}
                                                            </ul>
                                                       </div>
                                                  </Card>
                                             )}
                                        </>
                                   )}
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
