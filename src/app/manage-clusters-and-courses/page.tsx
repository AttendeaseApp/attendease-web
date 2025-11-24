"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ClusterSession, CourseSession } from "@/interface/cluster-and-course-interface"
import { deleteCourse, deleteCluster, getAllCourses } from "@/services/cluster-and-course-sessions"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { ClusterAndCourseTable } from "@/components/manage-clusters-and-courses/ClusterAndCourseTable"
import { ClusterTable } from "@/components/manage-clusters-and-courses/ClusterTable"
import { CreateClusterDialog } from "@/components/manage-clusters-and-courses/CreateClusterDialog"
import { CreateCourseDialog } from "@/components/manage-clusters-and-courses/CreateCourseDialog"
import { getAllClusters } from "@/services/cluster-and-course-sessions"
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
import { X } from "lucide-react"

export default function ManageClustersPage() {
     const [formData, setFormData] = useState({
          clusterId: "",
          clusterName: "",
     })
     const [courses, setCourses] = useState<CourseSession[]>([])
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)
     const [clusterSearchTerm, setClusterSearchTerm] = useState("")
     const [courseSearchTerm, setCourseSearchTerm] = useState("")
     const [selectedCluster, setSelectedCluster] = useState<ClusterSession | null>(null)
     const [isCreateClusterOpen, setIsCreateClusterOpen] = useState(false)
     const [isChooseClusterOpen, setIsChooseClusterOpen] = useState(false)
     const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)
     const [clusters, setClusters] = useState<ClusterSession[]>([])
     const [loadingClusters, setLoadingClusters] = useState(true)
     const loadClusters = async () => {
          try {
               setLoadingClusters(true)
               const data = await getAllClusters()
               setClusters(data)
          } catch (err) {
               console.error("Failed to load clusters:", err)
          } finally {
               setLoadingClusters(false)
          }
     }
     useEffect(() => {
          loadClusters()
     }, [])
     const loadCourses = async () => {
          try {
               setLoading(true)
               setError(null)
               const data = await getAllCourses()
               setCourses(data)
          } catch (err) {
               setError(err instanceof Error ? err.message : "Failed to load courses")
               console.error("Error loading courses:", err)
          } finally {
               setLoading(false)
          }
     }
     useEffect(() => {
          loadCourses()
     }, [])
     const filteredClusters = clusters.filter((cluster) =>
          cluster.clusterName.toLowerCase().includes(clusterSearchTerm.toLowerCase())
     )
     const filteredCourses = courses.filter((course) => {
          const clusterName = course.cluster?.clusterName ?? ""
          return (
               course.courseName.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
               clusterName.toLowerCase().includes(courseSearchTerm.toLowerCase())
          )
     })

     const handleCreateClusterOpen = () => setIsCreateClusterOpen(true)
     const handleCreateClusterClose = () => setIsCreateClusterOpen(false)
     const handleCreateClusterSuccess = () => {
          setIsCreateClusterOpen(false)
          loadClusters()
          loadCourses()
     }
     const handleCreateCourseOpen = () => setIsChooseClusterOpen(true)
     const handleCreateSuccess = () => {
          setIsChooseClusterOpen(false)
          loadCourses()
     }
     const handleInputChange = (field: keyof typeof formData, value: string) => {
          setFormData((prev) => ({ ...prev, [field]: value }))
          if (error) setError("")
     }
     const handleDelete = async (course: CourseSession) => {
          try {
               await deleteCourse(course.id)
               setCourses((prev) => prev.filter((c) => c.id !== course.id))
               alert("Course deleted successfully!")
          } catch (error) {
               console.error("Delete failed:", error)
               alert("Failed to delete course. Please try again.")
          }
     }
     const handleDeleteCluster = async (cluster: ClusterSession) => {
          try {
               await deleteCluster(cluster.clusterId)
               setClusters((prev) => prev.filter((c) => c.clusterId !== cluster.clusterId))
               loadCourses()
               alert("Cluster deleted successfully!")
          } catch (error) {
               console.error("Delete failed:", error)
               alert("Failed to delete cluster. Please try again.")
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
                              {error && (
                                   <div className="mt-4 p-4 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                        {error}
                                   </div>
                              )}
                              <ClusterTable
                                   clusters={filteredClusters}
                                   loading={loadingClusters}
                                   onDeleteAction={handleDeleteCluster}
                              />
                         </div>

                         {/*courses*/}
                         <div className="w-full">
                              <h2 className="text-lg font-semibold mb-4">COURSES</h2>
                              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                   <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                             placeholder="Search course..."
                                             className="pl-8"
                                             value={courseSearchTerm}
                                             onChange={(e) => setCourseSearchTerm(e.target.value)}
                                        />
                                   </div>
                                   <Button variant="outline" size="sm" onClick={loadCourses}>
                                        Refresh
                                   </Button>
                              </div>
                              {error && (
                                   <div className="mt-4 p-4 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                        {error}
                                   </div>
                              )}
                              <ClusterAndCourseTable
                                   courses={filteredCourses}
                                   loading={loading}
                                   onDelete={handleDelete}
                              />
                         </div>
                    </div>

                    {/*dialogs*/}
                    <CreateClusterDialog
                         isOpen={isCreateClusterOpen}
                         onClose={handleCreateClusterClose}
                         onCreate={handleCreateClusterSuccess}
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
                              {error && (
                                   <div className="p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">
                                        {error}
                                   </div>
                              )}
                              <DialogFooter className="flex justify-end space-x-2 pt-4">
                                   <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsChooseClusterOpen(false)}
                                   >
                                        <X className="mr-2 h-4 w-4" />
                                        Cancel
                                   </Button>
                                   <>
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
                                   </>
                              </DialogFooter>
                         </DialogContent>
                    </Dialog>
                    {isCreateCourseOpen && selectedCluster && (
                         <CreateCourseDialog
                              cluster={selectedCluster}
                              isOpen={isCreateCourseOpen}
                              onClose={() => setIsCreateCourseOpen(false)}
                              onCreate={handleCreateSuccess}
                              courses={courses}
                         />
                    )}
               </div>
          </ProtectedLayout>
     )
}
