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
import { Input } from "@/components/ui/input"
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
} from "@/services/api/academic/academic-year"
import {
     deleteCluster,
     deleteCourse,
     deleteSection,
     getAllClusters,
     getAllCourses,
     getAllSections,
} from "@/services/api/academic/cluster-and-course-sessions"
import { Plus, RefreshCw, Search } from "lucide-react"
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
     const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)
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
               console.warn("No active academic year")
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
          toast.success("All data refreshed")
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

                    {activeAcademicYear && <AcademicYearCard academicYear={activeAcademicYear} />}

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
                                             Refresh
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

                         {/*clusters tab */}
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
                                             Refresh
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

                         {/*courses tab*/}
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
                                             Refresh
                                        </Button>
                                        <Button
                                             size="sm"
                                             onClick={() => {
                                                  if (clusters.length === 0) {
                                                       toast.error("Please create a cluster first")
                                                       return
                                                  }
                                                  setSelectedCluster(clusters[0])
                                                  setIsCreateCourseOpen(true)
                                             }}
                                        >
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

                         {/*section tab*/}
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
                                             Refresh
                                        </Button>
                                        <Button
                                             size="sm"
                                             onClick={() => {
                                                  if (courses.length === 0) {
                                                       toast.error("Please create a course first")
                                                       return
                                                  }
                                                  setSelectedCourse(courses[0])
                                                  setIsCreateSectionOpen(true)
                                             }}
                                        >
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
                                   // Success toast handled by service
                              }}
                         />
                    )}

                    {/* Cluster/Course/Section Dialogs */}
                    <CreateClusterDialog
                         isOpen={isCreateClusterOpen}
                         onClose={() => setIsCreateClusterOpen(false)}
                         onCreate={() => {
                              setIsCreateClusterOpen(false)
                              loadClusters()
                              toast.success("Cluster created successfully")
                         }}
                    />

                    {selectedCluster && (
                         <>
                              <CreateCourseDialog
                                   cluster={selectedCluster}
                                   courses={courses}
                                   isOpen={isCreateCourseOpen}
                                   onClose={() => {
                                        setIsCreateCourseOpen(false)
                                        setSelectedCluster(null)
                                   }}
                                   onCreate={() => {
                                        setIsCreateCourseOpen(false)
                                        loadCourses()
                                        toast.success("Course created successfully")
                                   }}
                              />

                              <UpdateClusterDialog
                                   clusters={selectedCluster}
                                   isOpen={isEditClusterOpen}
                                   onClose={() => setIsEditClusterOpen(false)}
                                   onUpdate={() => {
                                        setIsEditClusterOpen(false)
                                        loadClusters()
                                        toast.success("Cluster updated successfully")
                                   }}
                              />
                         </>
                    )}

                    {selectedCourse && (
                         <>
                              <CreateSectionDialog
                                   course={selectedCourse}
                                   isOpen={isCreateSectionOpen}
                                   onClose={() => {
                                        setIsCreateSectionOpen(false)
                                        setSelectedCourse(null)
                                   }}
                                   onCreate={() => {
                                        setIsCreateSectionOpen(false)
                                        loadSections()
                                        toast.success("Section created successfully")
                                   }}
                              />

                              <UpdateCourseDialog
                                   cluster={selectedCourse.cluster!}
                                   courses={selectedCourse}
                                   isOpen={isEditCourseOpen}
                                   onClose={() => setIsEditCourseOpen(false)}
                                   onUpdate={() => {
                                        setIsEditCourseOpen(false)
                                        loadCourses()
                                        toast.success("Course updated successfully")
                                   }}
                              />
                         </>
                    )}

                    {selectedSection && (
                         <UpdateSectionDialog
                              course={selectedSection.course!}
                              section={selectedSection}
                              isOpen={isEditSectionOpen}
                              onClose={() => setIsEditSectionOpen(false)}
                              onUpdate={() => {
                                   setIsEditSectionOpen(false)
                                   loadSections()
                              }}
                         />
                    )}
               </div>
          </ProtectedLayout>
     )
}
