"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ClusterSession, CourseSession } from "@/interface/cluster-and-course-interface"
import {
     deleteCourse,
     deleteCluster,
     getAllCourses,
     getAllClusters,
} from "@/services/cluster-and-course-sessions"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { ClusterAndCourseTable } from "@/components/manage-clusters-and-courses/ClusterAndCourseTable"
import { ClusterTable } from "@/components/manage-clusters-and-courses/ClusterTable"
import { CreateClusterDialog } from "@/components/manage-clusters-and-courses/CreateClusterDialog"
import { CreateCourseDialog } from "@/components/manage-clusters-and-courses/CreateCourseDialog"
import ClusterCourseStatusDialog from "@/components/manage-clusters-and-courses/CreateClustercCoursesStatusDialog"
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
     DialogFooter,
} from "@/components/ui/dialog"
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function ManageClustersPage() {
     const [formData, setFormData] = useState({ clusterId: "", clusterName: "" })
     const [clusters, setClusters] = useState<ClusterSession[]>([])
     const [courses, setCourses] = useState<CourseSession[]>([])
     const [loadingClusters, setLoadingClusters] = useState(true)
     const [loadingCourses, setLoadingCourses] = useState(true)
     const [error, setError] = useState<string | null>(null)
     const [clusterSearchTerm, setClusterSearchTerm] = useState("")
     const [courseSearchTerm, setCourseSearchTerm] = useState("")
     const [selectedCluster, setSelectedCluster] = useState<ClusterSession | null>(null)
     const [isCreateClusterOpen, setIsCreateClusterOpen] = useState(false)
     const [isChooseClusterOpen, setIsChooseClusterOpen] = useState(false)
     const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)

     const [statusDialogOpen, setStatusDialogOpen] = useState(false)
     const [createStatus, setCreateStatus] = useState<"success" | "error">("success")
     const [createMessage, setCreateMessage] = useState("")

     const showStatus = (status: "success" | "error", message: string) => {
          setCreateStatus(status)
          setCreateMessage(message)
          setStatusDialogOpen(true)
     }

     const loadClusters = async () => {
          try {
               setLoadingClusters(true)
               const data = await getAllClusters()
               setClusters(data)
          } catch (err) {
               console.error("Failed to load clusters:", err)
               setError("Failed to load clusters")
          } finally {
               setLoadingClusters(false)
          }
     }

     const loadCourses = async () => {
          try {
               setLoadingCourses(true)
               setError(null)
               const data = await getAllCourses()
               setCourses(data)
          } catch (err) {
               setError(err instanceof Error ? err.message : "Failed to load courses")
               console.error("Error loading courses:", err)
          } finally {
               setLoadingCourses(false)
          }
     }

     useEffect(() => {
          loadClusters()
          loadCourses()
     }, [])

     const filteredClusters = clusters.filter((cluster) => {
          const lowerSearch = clusterSearchTerm.trim().toLowerCase()
          const searchWords = lowerSearch.split(" ").filter(Boolean)
          const fields = [cluster.clusterName]
          return searchWords.every((sw) =>
               fields.some((f) => (f?.toLowerCase() || "").includes(sw))
          )
     })

     const filteredCourses = courses.filter((course) => {
          const lowerSearch = courseSearchTerm.trim().toLowerCase()
          const searchWords = lowerSearch.split(" ").filter(Boolean)
          const clusterName = course.cluster?.clusterName ?? ""
          const fields = [course.courseName, clusterName]
          return searchWords.every((sw) =>
               fields.some((f) => (f?.toLowerCase() || "").includes(sw))
          )
     })

     const handleCreateClusterOpen = () => setIsCreateClusterOpen(true)
     const handleCreateClusterClose = () => setIsCreateClusterOpen(false)
     const handleCreateClusterSuccess = () => {
          setIsCreateClusterOpen(false)
          loadClusters()
          loadCourses()
          showStatus("success", "Successfully created Cluster.")
     }

     const handleCreateCourseOpen = () => setIsChooseClusterOpen(true)
     const handleCreateCourseSuccess = () => {
          setIsChooseClusterOpen(false)
          loadCourses()
          showStatus("success", "Successfully created Course.")
     }

     const handleInputChange = (field: keyof typeof formData, value: string) => {
          setFormData((prev) => ({ ...prev, [field]: value }))
          if (error) setError("")
     }

     const handleDeleteCluster = async (cluster: ClusterSession) => {
          try {
               await deleteCluster(cluster.clusterId)
               setClusters((prev) => prev.filter((c) => c.clusterId !== cluster.clusterId))
               loadCourses()
               alert("Cluster deleted successfully!")
          } catch (err) {
               console.error(err)
               alert("Failed to delete cluster. Please try again.")
          }
     }

     const handleDeleteCourse = async (course: CourseSession) => {
          try {
               await deleteCourse(course.id)
               setCourses((prev) => prev.filter((c) => c.id !== course.id))
               alert("Course deleted successfully!")
          } catch (err) {
               console.error(err)
               alert("Failed to delete course. Please try again.")
          }
     }

     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full h-full min-w-0 gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                         <div>
                              <h1 className="text-2xl font-bold md:text-3xl">
                                   Manage Clusters and Courses
                              </h1>
                              <p className="text-muted-foreground mt-1">
                                   Create and manage clusters and courses here.
                              </p>
                         </div>
                         <div className="flex sm:gap-4">
                              <Button className="sm:w-auto" onClick={handleCreateClusterOpen}>
                                   <Plus className="mr-2 h-4 w-4" />
                                   Create Cluster
                              </Button>
                              <Button className="sm:w-auto" onClick={handleCreateCourseOpen}>
                                   <Plus className="mr-2 h-4 w-4" />
                                   Create Course
                              </Button>
                         </div>
                    </div>

                    <div className="flex flex-row w-full h-full min-w-0 gap-12">
                         {/* clusters */}
                         <div className="w-full">
                              <h2 className="text-lg font-semibold mb-4">CLUSTERS</h2>
                              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                   <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                             placeholder="Search clusters..."
                                             className="pl-8"
                                             value={clusterSearchTerm}
                                             onChange={(e) => setClusterSearchTerm(e.target.value)}
                                        />
                                   </div>
                                   <Button variant="outline" size="sm" onClick={loadClusters}>
                                        Refresh
                                   </Button>
                              </div>
                              <ClusterTable
                                   clusters={filteredClusters}
                                   loading={loadingClusters}
                                   onDeleteAction={handleDeleteCluster}
                              />
                         </div>

                         {/* courses */}
                         <div className="w-full">
                              <h2 className="text-lg font-semibold mb-4">COURSES</h2>
                              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                   <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                             placeholder="Search courses..."
                                             className="pl-8"
                                             value={courseSearchTerm}
                                             onChange={(e) => setCourseSearchTerm(e.target.value)}
                                        />
                                   </div>
                                   <Button variant="outline" size="sm" onClick={loadCourses}>
                                        Refresh
                                   </Button>
                              </div>
                              <ClusterAndCourseTable
                                   courses={filteredCourses}
                                   loading={loadingCourses}
                                   onDelete={handleDeleteCourse}
                              />
                         </div>
                    </div>

                    {/* dialogs */}
                    <CreateClusterDialog
                         isOpen={isCreateClusterOpen}
                         onClose={handleCreateClusterClose}
                         onCreate={handleCreateClusterSuccess}
                         onError={(message) => showStatus("error", message)}
                         clusters={clusters}
                    />

                    <Dialog open={isChooseClusterOpen} onOpenChange={setIsChooseClusterOpen}>
                         <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                   <DialogTitle>Choose Cluster for the New Course</DialogTitle>
                                   <DialogDescription>
                                        Fill in the details to create a new course.
                                   </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-2">
                                   <Label htmlFor="clusterName">Cluster Name</Label>
                                   <Select
                                        value={formData.clusterId}
                                        disabled={loadingClusters}
                                        onValueChange={(value) => {
                                             handleInputChange("clusterId", value)
                                             const cluster =
                                                  clusters.find((c) => c.clusterId === value) ||
                                                  null
                                             setSelectedCluster(cluster)
                                        }}
                                   >
                                        <SelectTrigger>
                                             <SelectValue
                                                  placeholder={
                                                       loadingClusters
                                                            ? "Loading clusters..."
                                                            : "Select a cluster"
                                                  }
                                             />
                                        </SelectTrigger>
                                        <SelectContent>
                                             {clusters.map((cluster) => (
                                                  <SelectItem
                                                       key={cluster.clusterId}
                                                       value={cluster.clusterId}
                                                  >
                                                       {cluster.clusterName}
                                                  </SelectItem>
                                             ))}
                                        </SelectContent>
                                   </Select>
                              </div>
                              <DialogFooter className="flex justify-end space-x-2 pt-4">
                                   <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsChooseClusterOpen(false)}
                                   >
                                        <X className="mr-2 h-4 w-4" />
                                        Cancel
                                   </Button>
                                   <Button
                                        type="button"
                                        disabled={!selectedCluster}
                                        onClick={() => {
                                             setIsChooseClusterOpen(false)
                                             setIsCreateCourseOpen(true)
                                        }}
                                   >
                                        Next
                                   </Button>
                              </DialogFooter>
                         </DialogContent>
                    </Dialog>

                    {isCreateCourseOpen && selectedCluster && (
                         <CreateCourseDialog
                              cluster={selectedCluster}
                              courses={courses}
                              isOpen={isCreateCourseOpen}
                              onClose={() => setIsCreateCourseOpen(false)}
                              onCreate={handleCreateCourseSuccess}
                         />
                    )}

                    <ClusterCourseStatusDialog
                         open={statusDialogOpen}
                         status={createStatus}
                         message={createMessage}
                         onClose={() => setStatusDialogOpen(false)}
                    />
               </div>
          </ProtectedLayout>
     )
}
