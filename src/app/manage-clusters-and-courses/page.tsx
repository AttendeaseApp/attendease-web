"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ClusterSession, CourseSession, Section } from "@/interface/cluster-and-course-interface"
import {
     deleteCourse,
     deleteCluster,
     getAllCourses,
     getAllSections,
     deleteSection,
} from "@/services/cluster-and-course-sessions"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { ClusterAndCourseTable } from "@/components/manage-clusters-and-courses/ClusterAndCourseTable"
import { ClusterTable } from "@/components/manage-clusters-and-courses/ClusterTable"
import { CreateClusterDialog } from "@/components/manage-clusters-and-courses/CreateClusterDialog"
import { CreateCourseDialog } from "@/components/manage-clusters-and-courses/CreateCourseDialog"
import { getAllClusters } from "@/services/cluster-and-course-sessions"
import { CreateSectionDialog } from "@/components/manage-clusters-and-courses/CreateSectionDialog"
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
import { SectionTable } from "@/components/manage-clusters-and-courses/SectionTable"
import { UpdateClusterDialog } from "@/components/manage-clusters-and-courses/UpdateClusterDialog"
import { UpdateCourseDialog } from "@/components/manage-clusters-and-courses/UpdateCourseDialog"
import { UpdateSectionDialog } from "@/components/manage-clusters-and-courses/UpdateSectionDialog"

export default function ManageClustersPage() {
     const [formData, setFormData] = useState({
          clusterId: "",
          clusterName: "",
     })
     const [formSectionData, setFormSectionData] = useState({
          courseId: "",
          courseName: "",
     })
     const [courses, setCourses] = useState<CourseSession[]>([])
     const [loadingClusters, setLoadingClusters] = useState(true)
     const [loadingCourses, setLoadingCourses] = useState(true)
     const [error, setError] = useState<string | null>(null)
     const [clusterSearchTerm, setClusterSearchTerm] = useState("")
     const [courseSearchTerm, setCourseSearchTerm] = useState("")
     const [sectionSearchTerm, setSectionSearchTerm] = useState("")
     const [selectedCluster, setSelectedCluster] = useState<ClusterSession | null>(null)
     const [isCreateClusterOpen, setIsCreateClusterOpen] = useState(false)
     const [isChooseClusterOpen, setIsChooseClusterOpen] = useState(false)
     const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)
     const [clusters, setClusters] = useState<ClusterSession[]>([])
     const [sections, setSections] = useState<Section[]>([])
     const [loadingSections, setLoadingSections] = useState(true)
     const [isChooseCourseOpen, setIsChooseCourseOpen] = useState(false)
     const [selectedCourse, setSelectedCourse] = useState<CourseSession | null>(null)
     const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false)
     const [selectedSections, setSelectedSections] = useState<Section | null>(null)
     const [isEditClusterOpen, setIsEditClusterOpen] = useState(false)
     const [isEditCourseOpen, setIsEditCourseOpen] = useState(false)
     const [isEditSectionOpen, setIsEditSectionOpen] = useState(false)
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
               console.log("successfully get all courses")
          } catch (err) {
               setError(err instanceof Error ? err.message : "Failed to load courses")
               console.error("Error loading courses:", err)
          } finally {
               setLoadingCourses(false)
          }
     }
     const loadSections = async () => {
          try {
               setLoadingSections(true)
               setError(null)
               const data = await getAllSections()
               setSections(data)
               console.log("successfully get all sections")
          } catch (err) {
               setError(err instanceof Error ? err.message : "Failed to load sections")
               console.error("Error loading sections:", err)
          } finally {
               setLoadingSections(false)
          }
     }
     useEffect(() => {
          loadClusters()
          loadCourses()
          loadSections()
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

     const filteredSections = sections.filter((section) => {
          const lowerSearch = sectionSearchTerm.trim().toLowerCase()
          const searchWords = lowerSearch.split(" ").filter(Boolean)
          const courseName = section.course?.courseName ?? ""
          const fields = [section.name, courseName]
          return searchWords.every((sw) =>
               fields.some((f) => (f?.toLowerCase() || "").includes(sw))
          )
     })

     const handleEditCluster = (cluster: ClusterSession) => {
          setSelectedCluster(cluster)
          setIsEditClusterOpen(true)
     }
     const handleEditClusterClose = () => {
          setIsEditClusterOpen(false)
          setSelectedCluster(null)
     }
     const handleEditClusterUpdate = () => {
          setIsEditClusterOpen(false)
          setSelectedCluster(null)
          loadClusters()
          showStatus("success", "Successfully updated Cluster.")
     }

     const handleEditCourse = (course: CourseSession) => {
          setSelectedCourse(course)
          setIsEditCourseOpen(true)
     }
     const handleEditCourseClose = () => {
          setIsEditCourseOpen(false)
          setSelectedCourse(null)
     }
     const handleEditCourseUpdate = () => {
          setIsEditCourseOpen(false)
          setSelectedCourse(null)
          loadCourses()
          showStatus("success", "Successfully updated Course.")
     }

     const handleEditSection = (section: Section) => {
          setSelectedSections(section)
          setIsEditSectionOpen(true)
     }
     const handleEditSectionClose = () => {
          setIsEditSectionOpen(false)
          setSelectedSections(null)
     }
     const handleEditSectionUpdate = () => {
          setIsEditSectionOpen(false)
          setSelectedSections(null)
          loadSections()
          showStatus("success", "Successfully updated Section.")
     }

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
     const handleCreateSectionOpen = () => setIsChooseCourseOpen(true)
     const handleCreateSectionSuccess = () => {
          setIsChooseCourseOpen(false)
          loadSections()
          showStatus("success", "Successfully created Section.")
     }
     const handleInputChange = (field: keyof typeof formData, value: string) => {
          setFormData((prev) => ({ ...prev, [field]: value }))
          if (error) setError("")
     }
     const handleSectionInputChange = (field: keyof typeof formSectionData, value: string) => {
          setFormSectionData((prev) => ({ ...prev, [field]: value }))
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
     const handleDeleteSection = async (section: Section) => {
          try {
               await deleteSection(section.id)
               setSections((prev) => prev.filter((s) => s.id !== section.id))
               alert("Section deleted successfully!")
          } catch (error) {
               console.error("Delete failed:", error)
               alert("Failed to delete section. Please try again.")
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
                                   Manage Clusters, Courses and Sections
                              </h1>
                              <p className="text-muted-foreground mt-1">
                                   Create and manage clusters, courses and sections here.
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
                              <Button className="sm:w-auto" onClick={handleCreateSectionOpen}>
                                   <Plus className="mr-2 h-4 w-4" />
                                   Create Section
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
                                   onEdit={handleEditCluster}
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
                                   onEdit={handleEditCourse}
                                   onDelete={handleDeleteCourse}
                              />
                         </div>
                    </div>

                    {/* section */}
                    <div>
                         <div className="w-full">
                              <h2 className="text-lg font-semibold mb-4">SECTIONS</h2>
                              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                   <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                             placeholder="Search sections..."
                                             className="pl-8"
                                             value={sectionSearchTerm}
                                             onChange={(e) => setSectionSearchTerm(e.target.value)}
                                        />
                                   </div>
                                   <Button variant="outline" size="sm" onClick={loadSections}>
                                        Refresh
                                   </Button>
                              </div>
                              {error && (
                                   <div className="mt-4 p-4 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                        {error}
                                   </div>
                              )}
                              <SectionTable
                                   sections={filteredSections}
                                   loading={loadingSections}
                                   onEdit={handleEditSection}
                                   onDelete={handleDeleteSection}
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
                              onError={(message) => showStatus("error", message)}
                         />
                    )}

                    <Dialog open={isChooseCourseOpen} onOpenChange={setIsChooseCourseOpen}>
                         <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                   <DialogTitle>Choose Course for the New Section</DialogTitle>
                                   <DialogDescription>
                                        Fill in the details to create a new section.
                                   </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-2">
                                   <Label htmlFor="courseName">Courses</Label>
                                   <Select
                                        value={formSectionData.courseId}
                                        disabled={loadingCourses}
                                        onValueChange={(value) => {
                                             handleSectionInputChange("courseId", value)
                                             const course =
                                                  courses.find((c) => c.id === value) || null
                                             setSelectedCourse(course)
                                        }}
                                   >
                                        <SelectTrigger>
                                             <SelectValue
                                                  placeholder={
                                                       loadingCourses
                                                            ? "Loading courses..."
                                                            : "Select a course"
                                                  }
                                             />
                                        </SelectTrigger>
                                        <SelectContent>
                                             {courses.map((section) => (
                                                  <SelectItem key={section.id} value={section.id}>
                                                       {section.courseName}
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
                                        onClick={() => setIsChooseCourseOpen(false)}
                                   >
                                        <X className="mr-2 h-4 w-4" />
                                        Cancel
                                   </Button>
                                   <>
                                        <Button
                                             type="button"
                                             disabled={!selectedCourse}
                                             onClick={() => {
                                                  setIsChooseCourseOpen(false)
                                                  setIsCreateSectionOpen(true)
                                             }}
                                        >
                                             Next
                                        </Button>
                                   </>
                              </DialogFooter>
                         </DialogContent>
                    </Dialog>
                    {isCreateSectionOpen && selectedCourse && (
                         <CreateSectionDialog
                              course={selectedCourse}
                              isOpen={isCreateSectionOpen}
                              onClose={() => setIsCreateSectionOpen(false)}
                              onCreate={handleCreateSectionSuccess}
                              onError={(message) => showStatus("error", message)}
                         />
                    )}
                    {selectedCluster && (
                         <UpdateClusterDialog
                              isOpen={isEditClusterOpen}
                              onClose={handleEditClusterClose}
                              onUpdate={handleEditClusterUpdate}
                              onError={(message) => showStatus("error", message)}
                              clusters={selectedCluster}
                         />
                    )}
                    {selectedCourse && selectedCourse.cluster && (
                         <UpdateCourseDialog
                              cluster={selectedCourse.cluster}
                              isOpen={isEditCourseOpen}
                              onClose={handleEditCourseClose}
                              onUpdate={handleEditCourseUpdate}
                              onError={(message) => showStatus("error", message)}
                              courses={selectedCourse}
                         />
                    )}
                    {selectedSections && selectedSections.course && (
                         <UpdateSectionDialog
                              course={selectedSections.course}
                              isOpen={isEditSectionOpen}
                              onClose={handleEditSectionClose}
                              onUpdate={handleEditSectionUpdate}
                              onError={(message) => showStatus("error", message)}
                              section={selectedSections}
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
