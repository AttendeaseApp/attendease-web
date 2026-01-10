"use client"

import { AcademicYearCard } from "@/components/academic-management/card/AcademicYearCard"
import { CreateAcademicYearDialog } from "@/components/academic-management/dialogs/create/CreateAcademicYearDialog"
import { CreateClusterDialog } from "@/components/academic-management/dialogs/create/CreateClusterDialog"
import { CreateCourseDialog } from "@/components/academic-management/dialogs/create/CreateCourseDialog"
import { CreateSectionDialog } from "@/components/academic-management/dialogs/create/CreateSectionDialog"
import { UpdateAcademicYearDialog } from "@/components/academic-management/dialogs/update/UpdateAcademicYearDialog"
import { UpdateClusterDialog } from "@/components/academic-management/dialogs/update/UpdateClusterDialog"
import { UpdateCourseDialog } from "@/components/academic-management/dialogs/update/UpdateCourseDialog"
import { UpdateSectionDialog } from "@/components/academic-management/dialogs/update/UpdateSectionDialog"
import { AcademicYearTable } from "@/components/academic-management/tables/AcademicYearTable"
import { ClusterTable } from "@/components/academic-management/tables/ClusterTable"
import { CourseTable } from "@/components/academic-management/tables/CourseTable"
import { SectionTable } from "@/components/academic-management/tables/SectionTable"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
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
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cluster } from "@/interface/academic/cluster/ClusterInterface"
import { Course } from "@/interface/academic/course/CourseInterface"
import { Section } from "@/interface/academic/section/SectionInterface"
import {
     AcademicYear,
     activateAcademicYear,
     deactivateAcademicYear,
     deleteAcademicYear,
     getActiveAcademicYear,
     getAllAcademicYears,
     getSemesterStatus,
     SemesterStatus,
} from "@/services/api/academic/academic-year-management-service"
import { deleteSection, getAllSections } from "@/services/api/academic/section-management-service"
import { deleteCourse, getAllCourses } from "@/services/api/academic/course-management-service"
import { deleteCluster, getAllClusters } from "@/services/api/academic/cluster-management-service"
import { Plus, RefreshCw, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function ManageClustersPage() {
     const [clusters, setClusters] = useState<Cluster[]>([])
     const [courses, setCourses] = useState<Course[]>([])
     const [sections, setSections] = useState<Section[]>([])

     const [loadingClusters, setLoadingClusters] = useState(true)
     const [loadingCourses, setLoadingCourses] = useState(true)
     const [loadingSections, setLoadingSections] = useState(true)

     const [clusterSearchTerm, setClusterSearchTerm] = useState("")
     const [courseSearchTerm, setCourseSearchTerm] = useState("")
     const [sectionSearchTerm, setSectionSearchTerm] = useState("")

     const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null)
     const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
     const [selectedSection, setSelectedSection] = useState<Section | null>(null)

     const [isCreateClusterOpen, setIsCreateClusterOpen] = useState(false)
     const [isChooseClusterOpen, setIsChooseClusterOpen] = useState(false)
     const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)
     const [isChooseCourseOpen, setIsChooseCourseOpen] = useState(false)
     const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false)
     const [isEditClusterOpen, setIsEditClusterOpen] = useState(false)
     const [isEditCourseOpen, setIsEditCourseOpen] = useState(false)
     const [isEditSectionOpen, setIsEditSectionOpen] = useState(false)

     const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
     const [activeAcademicYear, setActiveAcademicYear] = useState<AcademicYear | null>(null)
     const [semesterStatus, setSemesterStatus] = useState<SemesterStatus | null>(null)
     const [loadingAcademicYears, setLoadingAcademicYears] = useState(true)
     const [loadingSemesterStatus, setLoadingSemesterStatus] = useState(true)
     const [academicYearSearchTerm, setAcademicYearSearchTerm] = useState("")
     const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYear | null>(null)
     const [isCreateAcademicYearOpen, setIsCreateAcademicYearOpen] = useState(false)
     const [isEditAcademicYearOpen, setIsEditAcademicYearOpen] = useState(false)

     const [tempClusterId, setTempClusterId] = useState("")
     const [tempCourseId, setTempCourseId] = useState("")

     const loadClusters = async () => {
          setLoadingClusters(true)
          try {
               const data = await getAllClusters()
               setClusters(data)
          } catch (err) {
               console.error("Failed to load clusters:", err)
          } finally {
               setLoadingClusters(false)
          }
     }

     const loadCourses = async () => {
          setLoadingCourses(true)
          try {
               const data = await getAllCourses()
               setCourses(data)
          } catch (err) {
               console.error("Failed to load courses:", err)
          } finally {
               setLoadingCourses(false)
          }
     }

     const loadSections = async () => {
          setLoadingSections(true)
          try {
               const data = await getAllSections()
               setSections(data)
          } catch (err) {
               console.error("Failed to load sections:", err)
          } finally {
               setLoadingSections(false)
          }
     }

     const loadAcademicYears = async () => {
          setLoadingAcademicYears(true)
          try {
               const data = await getAllAcademicYears()
               setAcademicYears(data)
          } catch (err) {
               console.error("Failed to load academic years:", err)
          } finally {
               setLoadingAcademicYears(false)
          }
     }

     const loadActiveAcademicYear = async () => {
          try {
               const data = await getActiveAcademicYear()
               setActiveAcademicYear(data)
          } catch (err) {
               console.warn(err)
               setActiveAcademicYear(null)
          }
     }

     const loadSemesterStatus = async () => {
          setLoadingSemesterStatus(true)
          try {
               const data = await getSemesterStatus()
               setSemesterStatus(data)
          } catch (err) {
               console.warn("Failed to load semester status:", err)
          } finally {
               setLoadingSemesterStatus(false)
          }
     }

     useEffect(() => {
          loadClusters()
          loadCourses()
          loadSections()
          loadAcademicYears()
          loadActiveAcademicYear()
          loadSemesterStatus()
     }, [])

     const filteredClusters = clusters.filter((c) =>
          c.clusterName.toLowerCase().includes(clusterSearchTerm.toLowerCase())
     )
     const filteredCourses = courses.filter((c) =>
          c.courseName.toLowerCase().includes(courseSearchTerm.toLowerCase())
     )
     const filteredSections = sections.filter((s) =>
          s.sectionName.toLowerCase().includes(sectionSearchTerm.toLowerCase())
     )
     const filteredAcademicYears = academicYears.filter((ay) =>
          ay.academicYearName.toLowerCase().includes(academicYearSearchTerm.toLowerCase())
     )

     const handleDeleteCluster = async (cluster: Cluster) => {
          try {
               await deleteCluster(cluster.clusterId)
               loadClusters()
               loadCourses()
               loadSections()
          } catch (err) {
               console.error("Failed to delete cluster:", err)
          }
     }

     const handleDeleteCourse = async (course: Course) => {
          try {
               await deleteCourse(course.id)
               loadCourses()
               loadSections()
          } catch (err) {
               console.error("Failed to delete course:", err)
          }
     }

     const handleDeleteSection = async (section: Section) => {
          try {
               await deleteSection(section.id)
               loadSections()
          } catch (err) {
               console.error("Failed to delete section:", err)
          }
     }

     const handleDeleteAcademicYear = async (academicYear: AcademicYear) => {
          try {
               await deleteAcademicYear(academicYear.id)
               loadAcademicYears()
               loadActiveAcademicYear()
               loadSemesterStatus()
          } catch (err) {
               console.error("Failed to delete academic year:", err)
          }
     }

     const handleActivateAcademicYear = async (academicYear: AcademicYear) => {
          try {
               await activateAcademicYear(academicYear.id)
               loadAcademicYears()
               loadActiveAcademicYear()
               loadSemesterStatus()
          } catch (err) {
               console.error("Failed to activate academic year:", err)
          }
     }

     const handleDeactivateAcademicYear = async (academicYear: AcademicYear) => {
          try {
               await deactivateAcademicYear(academicYear.id)
               loadAcademicYears()
               loadActiveAcademicYear()
               loadSemesterStatus()
          } catch (err) {
               console.error("Failed to deactivate academic year:", err)
          }
     }

     const handleRefreshAll = () => {
          loadClusters()
          loadCourses()
          loadSections()
          loadAcademicYears()
          loadActiveAcademicYear()
          loadSemesterStatus()
          toast.success("SUCCESS", {
               description: "All data refreshed",
          })
     }

     const handleCreateCourseClick = () => {
          if (clusters.length === 0) {
               toast.warning("WARNING", {
                    description: "Please create a cluster first",
               })
               return
          }
          setIsChooseClusterOpen(true)
     }

     const handleClusterSelected = () => {
          const cluster = clusters.find((c) => c.clusterId === tempClusterId)
          if (!cluster) return

          setSelectedCluster(cluster)
          setIsChooseClusterOpen(false)
          setIsCreateCourseOpen(true)
     }

     const handleCreateCourseSuccess = () => {
          setIsCreateCourseOpen(false)
          setSelectedCluster(null)
          setTempClusterId("")
          loadCourses()
     }

     const handleCreateSectionClick = () => {
          if (courses.length === 0) {
               toast.warning("WARNING", {
                    description: "Please create a course first",
               })
               return
          }
          setIsChooseCourseOpen(true)
     }

     const handleCourseSelected = () => {
          const course = courses.find((c) => c.id === tempCourseId)
          if (!course) return

          setSelectedCourse(course)
          setIsChooseCourseOpen(false)
          setIsCreateSectionOpen(true)
     }

     const handleCreateSectionSuccess = () => {
          setIsCreateSectionOpen(false)
          setSelectedCourse(null)
          setTempCourseId("")
          loadSections()
     }

     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full gap-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                         <div>
                              <h1 className="text-2xl md:text-3xl font-bold">
                                   Academic Management
                              </h1>
                              <p className="text-muted-foreground mt-1">
                                   Manage academic years, clusters, courses, and sections
                              </p>
                         </div>
                         <Button variant="outline" onClick={handleRefreshAll}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Refresh All
                         </Button>
                    </div>

                    <AcademicYearCard academicYear={activeAcademicYear} />

                    <Tabs defaultValue="academic-years" className="flex flex-col gap-4">
                         <TabsList className="grid w-full grid-cols-4">
                              <TabsTrigger value="academic-years">Academic Years</TabsTrigger>
                              <TabsTrigger value="clusters">Clusters</TabsTrigger>
                              <TabsTrigger value="courses">Courses</TabsTrigger>
                              <TabsTrigger value="sections">Sections</TabsTrigger>
                         </TabsList>

                         <TabsContent value="academic-years" className="space-y-4">
                              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                   <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                             placeholder="Search academic years..."
                                             className="pl-8"
                                             value={academicYearSearchTerm}
                                             onChange={(e) =>
                                                  setAcademicYearSearchTerm(e.target.value)
                                             }
                                        />
                                   </div>
                                   <div className="flex gap-2">
                                        <Button
                                             variant="outline"
                                             size="sm"
                                             onClick={loadAcademicYears}
                                        >
                                             <RefreshCw className="h-4 w-4" />
                                        </Button>
                                        <Button
                                             size="sm"
                                             onClick={() => setIsCreateAcademicYearOpen(true)}
                                        >
                                             <Plus className="mr-2 h-4 w-4" />
                                             Create Academic Year
                                        </Button>
                                   </div>
                              </div>

                              <AcademicYearTable
                                   academicYears={filteredAcademicYears}
                                   loading={loadingAcademicYears}
                                   onEdit={(ay) => {
                                        setSelectedAcademicYear(ay)
                                        setIsEditAcademicYearOpen(true)
                                   }}
                                   onDelete={handleDeleteAcademicYear}
                                   onActivate={handleActivateAcademicYear}
                                   onDeactivate={handleDeactivateAcademicYear}
                              />
                         </TabsContent>

                         <TabsContent value="clusters" className="space-y-4">
                              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                   <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                             placeholder="Search clusters..."
                                             className="pl-8"
                                             value={clusterSearchTerm}
                                             onChange={(e) => setClusterSearchTerm(e.target.value)}
                                        />
                                   </div>
                                   <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={loadClusters}>
                                             <RefreshCw className="h-4 w-4" />
                                        </Button>
                                        <Button
                                             size="sm"
                                             onClick={() => setIsCreateClusterOpen(true)}
                                        >
                                             <Plus className="mr-2 h-4 w-4" />
                                             Create Cluster
                                        </Button>
                                   </div>
                              </div>

                              <ClusterTable
                                   clusters={filteredClusters}
                                   loading={loadingClusters}
                                   onEditAction={(c) => {
                                        setSelectedCluster(c)
                                        setIsEditClusterOpen(true)
                                   }}
                                   onDeleteAction={handleDeleteCluster}
                              />
                         </TabsContent>

                         <TabsContent value="courses" className="space-y-4">
                              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                   <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                             placeholder="Search courses..."
                                             className="pl-8"
                                             value={courseSearchTerm}
                                             onChange={(e) => setCourseSearchTerm(e.target.value)}
                                        />
                                   </div>
                                   <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={loadCourses}>
                                             <RefreshCw className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" onClick={handleCreateCourseClick}>
                                             <Plus className="mr-2 h-4 w-4" />
                                             Create Course
                                        </Button>
                                   </div>
                              </div>

                              <CourseTable
                                   courses={filteredCourses}
                                   loading={loadingCourses}
                                   onEdit={(c) => {
                                        setSelectedCourse(c)
                                        setIsEditCourseOpen(true)
                                   }}
                                   onDelete={handleDeleteCourse}
                              />
                         </TabsContent>

                         <TabsContent value="sections" className="space-y-4">
                              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                   <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                             placeholder="Search sections..."
                                             className="pl-8"
                                             value={sectionSearchTerm}
                                             onChange={(e) => setSectionSearchTerm(e.target.value)}
                                        />
                                   </div>
                                   <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={loadSections}>
                                             <RefreshCw className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" onClick={handleCreateSectionClick}>
                                             <Plus className="mr-2 h-4 w-4" />
                                             Create Section
                                        </Button>
                                   </div>
                              </div>

                              <SectionTable
                                   sections={filteredSections}
                                   loading={loadingSections}
                                   onEdit={(s) => {
                                        setSelectedSection(s)
                                        setIsEditSectionOpen(true)
                                   }}
                                   onDelete={handleDeleteSection}
                              />
                         </TabsContent>
                    </Tabs>

                    {/* DIALOGS */}
                    {/* Academic Year Dialogs */}
                    <CreateAcademicYearDialog
                         isOpen={isCreateAcademicYearOpen}
                         onClose={() => setIsCreateAcademicYearOpen(false)}
                         onCreate={() => {
                              setIsCreateAcademicYearOpen(false)
                              loadAcademicYears()
                              loadActiveAcademicYear()
                              loadSemesterStatus()
                         }}
                    />

                    {selectedAcademicYear && (
                         <UpdateAcademicYearDialog
                              academicYear={selectedAcademicYear}
                              isOpen={isEditAcademicYearOpen}
                              onClose={() => {
                                   setIsEditAcademicYearOpen(false)
                                   setSelectedAcademicYear(null)
                              }}
                              onUpdate={() => {
                                   setIsEditAcademicYearOpen(false)
                                   loadAcademicYears()
                                   loadActiveAcademicYear()
                                   loadSemesterStatus()
                              }}
                         />
                    )}

                    {/* Cluster Dialogs */}
                    <CreateClusterDialog
                         isOpen={isCreateClusterOpen}
                         onClose={() => setIsCreateClusterOpen(false)}
                         onCreate={() => {
                              setIsCreateClusterOpen(false)
                              loadClusters()
                         }}
                    />

                    {selectedCluster && isEditClusterOpen && (
                         <UpdateClusterDialog
                              clusters={selectedCluster}
                              isOpen={isEditClusterOpen}
                              onClose={() => {
                                   setIsEditClusterOpen(false)
                                   setSelectedCluster(null)
                              }}
                              onUpdate={() => {
                                   setIsEditClusterOpen(false)
                                   setSelectedCluster(null)
                                   loadClusters()
                              }}
                         />
                    )}

                    {/* Choose Cluster Dialog (before creating course) */}
                    <Dialog
                         open={isChooseClusterOpen}
                         onOpenChange={(open) => {
                              setIsChooseClusterOpen(open)
                              if (!open) {
                                   setTempClusterId("")
                              }
                         }}
                    >
                         <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                   <DialogTitle>Choose Cluster for the New Course</DialogTitle>
                                   <DialogDescription>
                                        Select which cluster this course belongs to.
                                   </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-2">
                                   <Label htmlFor="clusterName">Cluster Name</Label>
                                   <Select
                                        value={tempClusterId}
                                        disabled={loadingClusters}
                                        onValueChange={setTempClusterId}
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
                                        onClick={() => {
                                             setIsChooseClusterOpen(false)
                                             setTempClusterId("")
                                        }}
                                   >
                                        <X className="mr-2 h-4 w-4" />
                                        Cancel
                                   </Button>
                                   <Button
                                        type="button"
                                        disabled={!tempClusterId}
                                        onClick={handleClusterSelected}
                                   >
                                        Next
                                   </Button>
                              </DialogFooter>
                         </DialogContent>
                    </Dialog>

                    {/* Create Course Dialog */}
                    {selectedCluster && isCreateCourseOpen && (
                         <CreateCourseDialog
                              cluster={selectedCluster}
                              courses={courses}
                              isOpen={isCreateCourseOpen}
                              onClose={() => {
                                   setIsCreateCourseOpen(false)
                                   setSelectedCluster(null)
                                   setTempClusterId("")
                              }}
                              onCreate={handleCreateCourseSuccess}
                         />
                    )}

                    {/* Update Course Dialog */}
                    {selectedCourse && isEditCourseOpen && selectedCourse.cluster && (
                         <UpdateCourseDialog
                              cluster={selectedCourse.cluster}
                              courses={selectedCourse}
                              isOpen={isEditCourseOpen}
                              onClose={() => {
                                   setIsEditCourseOpen(false)
                                   setSelectedCourse(null)
                              }}
                              onUpdate={() => {
                                   setIsEditCourseOpen(false)
                                   setSelectedCourse(null)
                                   loadCourses()
                              }}
                         />
                    )}

                    {/* Choose Course Dialog (before creating section) */}
                    <Dialog
                         open={isChooseCourseOpen}
                         onOpenChange={(open) => {
                              setIsChooseCourseOpen(open)
                              if (!open) {
                                   setTempCourseId("")
                              }
                         }}
                    >
                         <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                   <DialogTitle>Choose Course for the New Section</DialogTitle>
                                   <DialogDescription>
                                        Select which course this section belongs to.
                                   </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-2">
                                   <Label htmlFor="courseName">Course</Label>
                                   <Select
                                        value={tempCourseId}
                                        disabled={loadingCourses}
                                        onValueChange={setTempCourseId}
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
                                             {courses.map((course) => (
                                                  <SelectItem key={course.id} value={course.id}>
                                                       {course.courseName}
                                                  </SelectItem>
                                             ))}
                                        </SelectContent>
                                   </Select>
                              </div>

                              <DialogFooter className="flex justify-end space-x-2 pt-4">
                                   <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                             setIsChooseCourseOpen(false)
                                             setTempCourseId("")
                                        }}
                                   >
                                        <X className="mr-2 h-4 w-4" />
                                        Cancel
                                   </Button>
                                   <Button
                                        type="button"
                                        disabled={!tempCourseId}
                                        onClick={handleCourseSelected}
                                   >
                                        Next
                                   </Button>
                              </DialogFooter>
                         </DialogContent>
                    </Dialog>

                    {/* Create Section Dialog */}
                    {selectedCourse && isCreateSectionOpen && (
                         <CreateSectionDialog
                              course={selectedCourse}
                              isOpen={isCreateSectionOpen}
                              onClose={() => {
                                   setIsCreateSectionOpen(false)
                                   setSelectedCourse(null)
                                   setTempCourseId("")
                              }}
                              onCreate={handleCreateSectionSuccess}
                         />
                    )}

                    {/* Update Section Dialog */}
                    {selectedSection && isEditSectionOpen && selectedSection.course && (
                         <UpdateSectionDialog
                              course={selectedSection.course}
                              section={selectedSection}
                              isOpen={isEditSectionOpen}
                              onClose={() => {
                                   setIsEditSectionOpen(false)
                                   setSelectedSection(null)
                              }}
                              onUpdate={() => {
                                   setIsEditSectionOpen(false)
                                   setSelectedSection(null)
                                   loadSections()
                              }}
                         />
                    )}
               </div>
          </ProtectedLayout>
     )
}
