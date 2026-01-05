"use client"

import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { CreateClusterDialog } from "@/components/academic-management/dialogs/create/CreateClusterDialog"
import { CreateCourseDialog } from "@/components/academic-management/dialogs/create/CreateCourseDialog"
import { CreateSectionDialog } from "@/components/academic-management/dialogs/create/CreateSectionDialog"
import { UpdateClusterDialog } from "@/components/academic-management/dialogs/update/UpdateClusterDialog"
import { UpdateCourseDialog } from "@/components/academic-management/dialogs/update/UpdateCourseDialog"
import { UpdateSectionDialog } from "@/components/academic-management/dialogs/update/UpdateSectionDialog"
import { AcademicClusterTable } from "@/components/academic-management/tables/AcademicClusterTable"
import { AcademicCourseTable } from "@/components/academic-management/tables/AcademicCourseTable"
import { AcademicSectionTable } from "@/components/academic-management/tables/AcademicSectionTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import { Cluster } from "@/interface/academic/cluster/ClusterInterface"
import { Course } from "@/interface/academic/course/CourseInterface"
import { Section } from "@/interface/academic/section/SectionInterface"
import {
     deleteCluster,
     deleteCourse,
     deleteSection,
     getAllClusters,
     getAllCourses,
     getAllSections,
} from "@/services/cluster-and-course-sessions"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ManageClustersPage() {
     // ------------------ Data ------------------
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

     // ------------------ Load Data ------------------
     const loadClusters = async () => {
          setLoadingClusters(true)
          try {
               const data = await getAllClusters()
               setClusters(data)
          } catch (err) {
               toast.error(err instanceof Error ? err.message : "Failed to load clusters")
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
               toast.error(err instanceof Error ? err.message : "Failed to load courses")
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
               toast.error(err instanceof Error ? err.message : "Failed to load sections")
          } finally {
               setLoadingSections(false)
          }
     }

     useEffect(() => {
          loadClusters()
          loadCourses()
          loadSections()
     }, [])

     // ------------------ Filtered Lists ------------------
     const filteredClusters = clusters.filter((c) =>
          c.clusterName.toLowerCase().includes(clusterSearchTerm.toLowerCase())
     )
     const filteredCourses = courses.filter((c) =>
          c.courseName.toLowerCase().includes(courseSearchTerm.toLowerCase())
     )
     const filteredSections = sections.filter((s) =>
          s.sectionName.toLowerCase().includes(sectionSearchTerm.toLowerCase())
     )

     // ------------------ Delete Handlers ------------------
     const handleDeleteCluster = async (cluster: Cluster) => {
          try {
               await deleteCluster(cluster.clusterId)
               toast.success(`Cluster "${cluster.clusterName}" deleted`)
               loadClusters()
               loadCourses()
               loadSections()
          } catch (err) {
               toast.error(err instanceof Error ? err.message : "Delete failed")
          }
     }

     const handleDeleteCourse = async (course: Course) => {
          try {
               await deleteCourse(course.id)
               toast.success(`Course "${course.courseName}" deleted`)
               loadCourses()
               loadSections()
          } catch (err) {
               toast.error(err instanceof Error ? err.message : "Delete failed")
          }
     }

     const handleDeleteSection = async (section: Section) => {
          try {
               await deleteSection(section.id)
               toast.success(`Section "${section.sectionName}" deleted`)
               loadSections()
          } catch (err) {
               toast.error(err instanceof Error ? err.message : "Delete failed")
          }
     }

     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full gap-6">
                    {/* ------------------ Header ------------------ */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                         <div>
                              <h1 className="text-2xl md:text-3xl font-bold">
                                   Manage Clusters, Courses & Sections
                              </h1>
                              <p className="text-muted-foreground mt-1">
                                   Create and manage clusters, courses, and sections here.
                              </p>
                         </div>
                         <div className="flex gap-4">
                              <Button onClick={() => setIsCreateClusterOpen(true)}>
                                   <Plus className="mr-2 h-4 w-4" />
                                   Create Cluster
                              </Button>
                              <Button
                                   onClick={() => {
                                        if (clusters.length === 0) {
                                             toast.error("Please create a cluster first")
                                             return
                                        }
                                        setSelectedCluster(clusters[0]) // default first cluster
                                        setIsCreateCourseOpen(true)
                                   }}
                              >
                                   <Plus className="mr-2 h-4 w-4" />
                                   Create Course
                              </Button>
                              <Button
                                   onClick={() => {
                                        if (courses.length === 0) {
                                             toast.error("Please create a course first")
                                             return
                                        }
                                        setSelectedCourse(courses[0]) // default first course
                                        setIsCreateSectionOpen(true)
                                   }}
                              >
                                   <Plus className="mr-2 h-4 w-4" />
                                   Create Section
                              </Button>
                         </div>
                    </div>

                    {/* ------------------ Tabs ------------------ */}
                    <Tabs defaultValue="clusters" className="flex flex-col gap-4">
                         <TabsList>
                              <TabsTrigger value="clusters">Clusters</TabsTrigger>
                              <TabsTrigger value="courses">Courses</TabsTrigger>
                              <TabsTrigger value="sections">Sections</TabsTrigger>
                         </TabsList>

                         {/* ------------------ Clusters Tab ------------------ */}
                         <TabsContent value="clusters">
                              <div className="flex flex-col gap-4 md:flex-row md:items-center mb-2">
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

                              <AcademicClusterTable
                                   clusters={filteredClusters}
                                   loading={loadingClusters}
                                   onEditAction={(c) => {
                                        setSelectedCluster(c)
                                        setIsEditClusterOpen(true)
                                   }}
                                   onDeleteAction={handleDeleteCluster}
                              />
                         </TabsContent>

                         {/* ------------------ Courses Tab ------------------ */}
                         <TabsContent value="courses">
                              <div className="flex flex-col gap-4 md:flex-row md:items-center mb-2">
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

                              <AcademicCourseTable
                                   courses={filteredCourses}
                                   loading={loadingCourses}
                                   onEdit={(c) => {
                                        setSelectedCourse(c)
                                        setIsEditCourseOpen(true)
                                   }}
                                   onDelete={handleDeleteCourse}
                              />
                         </TabsContent>

                         {/* ------------------ Sections Tab ------------------ */}
                         <TabsContent value="sections">
                              <div className="flex flex-col gap-4 md:flex-row md:items-center mb-2">
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

                              <AcademicSectionTable
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

                    {/* ------------------ Dialogs ------------------ */}
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
                    )}

                    {selectedCourse && (
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
                    )}

                    {selectedCluster && (
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
                    )}

                    {selectedCourse && (
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
                                   toast.success("Section updated successfully")
                              }}
                         />
                    )}
               </div>
          </ProtectedLayout>
     )
}
