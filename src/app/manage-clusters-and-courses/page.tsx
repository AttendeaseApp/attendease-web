"use client"

import React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ClusterSession, CourseSession } from "@/interface/cluster-and-course-interface"
import { deleteCourse, getAllCourses } from "@/services/cluster-and-course-sessions"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { ClusterAndCourseTable } from "@/components/manage-clusters-and-courses/ClusterAndCourseTable"
import { CreateClusterDialog } from "@/components/manage-clusters-and-courses/CreateClusterDialog"
import { CreateCourseDialog } from "@/components/manage-clusters-and-courses/CreateCourseDialog"
import { getAllClusters } from "@/services/cluster-and-course-sessions"

export default function ManageClustersPage() {

  const [formData, setFormData] = useState({
    clusterId: "",
    clusterName: ""
  })

  const [courses, setCourses] = useState<CourseSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<CourseSession | null>(null)
  const [selectedCluster, setSelectedCluster] = useState<ClusterSession | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [clusters, setClusters] = useState<ClusterSession[]>([])
  const [loadingClusters, setLoadingClusters] = useState(true)
  
    useEffect(() => {
      const loadClusters = async () => {
        try {
          setLoadingClusters(true)
          const data = await getAllClusters()
          setClusters(data)
        } catch (err) {
          console.error("Failed to load locations:", err)
        } finally {
          setLoadingClusters(false)
        }
      }
  
      loadClusters()
    }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllCourses()
      setCourses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events")
      console.error("Error loading events:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (event: CourseSession) => {
    setSelectedCourse(event)
    setIsEditOpen(true)
  }

  const handleEditClose = () => {
    setIsEditOpen(false)
    setSelectedCourse(null)
  }

  const handleEditUpdate = () => {
    setIsEditOpen(false)
    setSelectedCourse(null)
    loadCourses()
  }

  const handleCreateOpen = () => setIsCreateOpen(true)
  const handleCreateClose = () => setIsCreateOpen(false)
  const handleCreateSuccess = () => {
    setIsCreateOpen(false)
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
      alert("Event deleted successfully!")
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Failed to delete event. Please try again.")
    }
  }

  return (
    <ProtectedLayout>
      <div className="flex flex-col w-full h-full min-w-0 gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Manage Clusters</h1>
            <p className="text-muted-foreground mt-1">Create and manage clusters here.</p>
          </div>

          <div className="flex sm:gap-4">
            <Button className="sm:w-auto" onClick={handleCreateOpen}>
              <Plus className="mr-2 h-4 w-4" />
              Create Cluster
            </Button>

            <Button className="sm:w-auto" onClick={handleCreateOpen}>
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Button>

          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search course..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            <CreateClusterDialog
              isOpen={isCreateOpen}
              onClose={handleCreateClose}
              onCreate={handleCreateSuccess}
            />

            {selectedCluster && (
            <CreateCourseDialog
              course={selectedCluster}
              isOpen={isCreateOpen}
              onClose={handleCreateClose}
              onCreate={handleCreateSuccess}
            />
            )}
            
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
