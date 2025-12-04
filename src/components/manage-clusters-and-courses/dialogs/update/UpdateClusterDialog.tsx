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
import { Cluster } from "@/interface/academic/cluster/ClusterInterface"
import { updateCluster } from "@/services/cluster-and-course-sessions"
import { Plus, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface UpdateClusterDialogProps {
     isOpen: boolean
     onClose: () => void
     onUpdate: () => void
     onError?: (message: string) => void
     clusters: Cluster
}

export function UpdateClusterDialog({
     isOpen,
     onClose,
     onUpdate,
     clusters,
}: UpdateClusterDialogProps) {
     const [formData, setFormData] = useState({
          clusterName: clusters.clusterName,
     })

     const [error, setError] = useState<string>("")

     const [isSubmitting, setIsSubmitting] = useState(false)

     useEffect(() => {
          if (isOpen) {
               setFormData({
                    clusterName: clusters.clusterName || "",
               })
               setError("")
          }
     }, [isOpen, clusters])

     const handleInputChange = (field: keyof typeof formData, value: string) => {
          setFormData((prev) => ({ ...prev, [field]: value }))
          if (error) setError("")
     }

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          setError("")
          setIsSubmitting(true)
          try {
               const updateClusterData = {
                    clusterName: formData.clusterName,
               }
               console.log("Sending update payload:", updateClusterData)
               await updateCluster(clusters.clusterId, updateClusterData)
               onUpdate()
               onClose()
          } catch (err) {
               const message =
                    (err instanceof Error ? err.message : String(err)) +
                    " Failed to update cluster."
               setError(message)
               console.error("Update failed:", err)
               toast.error(message)
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
                         <DialogTitle>Update Cluster: {clusters.clusterName}</DialogTitle>
                         <DialogDescription>
                              Fill in the details to update the cluster.
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
                                   {isSubmitting ? "Updating..." : "Update Cluster"}
                              </Button>
                         </DialogFooter>
                    </form>
               </DialogContent>
          </Dialog>
     )
}
