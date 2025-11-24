"use client"
import { useEffect, useState } from "react"
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
     DialogFooter,
} from "@/components/ui/dialog"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCluster } from "@/services/cluster-and-course-sessions"
interface CreateClusterDialogProps {
     isOpen: boolean
     onClose: () => void
     onCreate: () => void
     clusters: { clusterName: string }[]
}
export function CreateClusterDialog({
     isOpen,
     onClose,
     onCreate,
     clusters,
}: CreateClusterDialogProps) {
     const [formData, setFormData] = useState({
          clusterName: "",
     })
     const [error, setError] = useState<string>("")
     const [isSubmitting, setIsSubmitting] = useState(false)
     useEffect(() => {
          if (isOpen) {
               setFormData({
                    clusterName: "",
               })
               setError("")
          }
     }, [isOpen])
     const handleInputChange = (field: keyof typeof formData, value: string) => {
          setFormData((prev) => ({ ...prev, [field]: value }))
          if (error) setError("")
     }

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          setError("")

          const duplicate = clusters.some(
               (c) =>
                    c.clusterName.toLowerCase().trim() === formData.clusterName.toLowerCase().trim()
          )

          if (duplicate) {
               setError("Cluster name already exists.")
               return
          }
          setIsSubmitting(true)
          try {
               const newClusterData = {
                    clusterName: formData.clusterName,
               }
               console.log("Sending create payload:", newClusterData)
               await createCluster(newClusterData)
               onCreate()
               onClose()
          } catch (err) {
               console.error("Create failed:", err)
               setError(err instanceof Error ? err.message : "Failed to create cluster.")
          } finally {
               setIsSubmitting(false)
          }
     }
     const handleClose = () => {
          onClose()
     }
     if (!isOpen) return null
     return (
          <Dialog open={isOpen} onOpenChange={handleClose}>
               <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                         <DialogTitle>Create New Cluster</DialogTitle>
                         <DialogDescription>
                              Fill in the details to create a new cluster.
                         </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div className="space-y-2">
                              <Label htmlFor="clusterName">Cluster Name</Label>
                              <Input
                                   id="clusterName"
                                   value={formData.clusterName}
                                   onChange={(e) =>
                                        handleInputChange("clusterName", e.target.value)
                                   }
                                   placeholder="Enter cluster name"
                                   required
                              />
                         </div>
                         {error && (
                              <div className="p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">
                                   {error}
                              </div>
                         )}
                         <DialogFooter className="flex justify-end space-x-2 pt-4">
                              <Button
                                   type="button"
                                   variant="outline"
                                   onClick={handleClose}
                                   disabled={isSubmitting}
                              >
                                   <X className="mr-2 h-4 w-4" />
                                   Cancel
                              </Button>
                              <Button
                                   type="submit"
                                   disabled={isSubmitting || !formData.clusterName.trim()}
                              >
                                   <Plus className="mr-2 h-4 w-4" />
                                   {isSubmitting ? "Creating..." : "Create Cluster"}
                              </Button>
                         </DialogFooter>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
