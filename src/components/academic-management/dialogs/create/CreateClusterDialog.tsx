"use client"
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
import { createCluster } from "@/services/cluster-and-course-sessions"
import { Plus, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface CreateClusterDialogProps {
     isOpen: boolean
     onClose: () => void
     onCreate: () => void
}

interface BackendError {
     response?: {
          data?: {
               message?: string
          }
     }
}

export function CreateClusterDialog({ isOpen, onClose, onCreate }: CreateClusterDialogProps) {
     const [clusterName, setClusterName] = useState("")
     const [isSubmitting, setIsSubmitting] = useState(false)

     useEffect(() => {
          if (isOpen) {
               setClusterName("")
          }
     }, [isOpen])

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          setIsSubmitting(true)

          try {
               await createCluster({ clusterName })
               toast.success(`Cluster '${clusterName}' created successfully.`)
               onCreate()
               onClose()
          } catch (err: unknown) {
               let message = "Failed to create cluster."

               const backendErr = err as BackendError
               if (
                    backendErr.response?.data?.message &&
                    typeof backendErr.response.data.message === "string"
               ) {
                    message = backendErr.response.data.message
               } else if (err instanceof Error) {
                    message = err.message
               }
               console.error("Create cluster failed:", err)
               toast.error(message)
          } finally {
               setIsSubmitting(false)
          }
     }

     if (!isOpen) return null

     return (
          <Dialog open={isOpen} onOpenChange={onClose}>
               <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                         <DialogTitle>Create New Cluster</DialogTitle>
                         <DialogDescription>
                              Enter a unique cluster name. Only uppercase letters and digits are
                              allowed.
                         </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div className="space-y-2">
                              <Label htmlFor="clusterName">Cluster Name</Label>
                              <Input
                                   id="clusterName"
                                   value={clusterName}
                                   onChange={(e) => setClusterName(e.target.value)}
                                   placeholder="Enter cluster name"
                                   required
                              />
                         </div>

                         <DialogFooter className="flex justify-end space-x-2 pt-4">
                              <Button
                                   type="button"
                                   variant="outline"
                                   onClick={onClose}
                                   disabled={isSubmitting}
                              >
                                   <X className="mr-2 h-4 w-4" />
                                   Cancel
                              </Button>
                              <Button type="submit" disabled={isSubmitting || !clusterName.trim()}>
                                   <Plus className="mr-2 h-4 w-4" />
                                   {isSubmitting ? "Creating..." : "Create Cluster"}
                              </Button>
                         </DialogFooter>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
