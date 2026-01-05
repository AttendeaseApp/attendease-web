import { Course } from "@/interface/academic/course/CourseInterface"
import { Section } from "@/interface/academic/section/SectionInterface"
import { Cluster } from "@/interface/academic/cluster/ClusterInterface"
import { authFetch } from "../../auth-fetch"
import { CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS } from "@/constants/api"
import { toast } from "sonner"

interface BulkSectionRequest {
     sectionName: string
     yearLevel: number
     semester: number
}

interface BulkSectionError {
     index: number
     sectionName: string
     error: string
}

interface BulkSectionResult {
     successful: Section[]
     errors: BulkSectionError[]
     totalProcessed: number
     successCount: number
     errorCount: number
}

interface ErrorResponse {
     message?: string
     error?: string
     errors?: Array<{ defaultMessage?: string }>
}

/**
 * Extracts and formats error message from response
 */
const handleApiError = async (res: Response, defaultMessage: string): Promise<never> => {
     let errorMessage = defaultMessage

     try {
          const contentType = res.headers.get("content-type")

          if (contentType?.includes("application/json")) {
               const errorBody: ErrorResponse = await res.json()
               errorMessage =
                    errorBody.message ||
                    errorBody.error ||
                    (Array.isArray(errorBody.errors) && errorBody.errors[0]?.defaultMessage) ||
                    defaultMessage
          } else {
               const textError = await res.text()
               if (textError && textError.trim()) {
                    errorMessage = textError
               }
          }
     } catch (parseError) {
          console.error("Failed to parse error response:", parseError)
          errorMessage = res.statusText || defaultMessage
     }

     throw new Error(errorMessage)
}

/**
 * Get all clusters
 */
export const getAllClusters = async (): Promise<Cluster[]> => {
     try {
          const res = await authFetch(CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.GET_ALL_CLUSTERS)

          if (!res.ok) {
               await handleApiError(res, "Failed to fetch clusters")
          }

          return res.json()
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch clusters"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Create a new cluster
 */
export const createCluster = async (newClusterData: Partial<Cluster>): Promise<Cluster> => {
     try {
          const res = await authFetch(CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.CREATE_CLUSTER, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(newClusterData),
          })

          if (!res.ok) {
               await handleApiError(res, "Failed to create cluster")
          }

          const result = await res.json()
          toast.success(`Cluster "${result.clusterName}" created successfully`)
          return result
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to create cluster"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Update an existing cluster
 */
export const updateCluster = async (
     id: string,
     updateClusterData: Partial<Cluster>
): Promise<Cluster> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.UPDATE_CLUSTER(id),
               {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updateClusterData),
               }
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to update cluster")
          }

          const result = await res.json()
          toast.success(`Cluster "${result.clusterName}" updated successfully`)
          return result
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update cluster"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Delete a cluster
 */
export const deleteCluster = async (id: string): Promise<void> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.DELETE_CLUSTER(id),
               {
                    method: "DELETE",
               }
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to delete cluster")
          }

          toast.success("Cluster deleted successfully")
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete cluster"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Get all courses
 */
export const getAllCourses = async (): Promise<Course[]> => {
     try {
          const res = await authFetch(CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.GET_ALL_COURSES)

          if (!res.ok) {
               await handleApiError(res, "Failed to fetch courses")
          }

          return res.json()
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch courses"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Create a new course
 */
export const createCourse = async (
     clusterId: string,
     newCourseData: Partial<Course>
): Promise<Course> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.CREATE_COURSE(clusterId),
               {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newCourseData),
               }
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to create course")
          }

          const result = await res.json()
          toast.success(`Course "${result.courseName}" created successfully`)
          return result
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to create course"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Update an existing course
 */
export const updateCourse = async (
     id: string,
     updateCourseData: Partial<Course>
): Promise<Course> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.UPDATE_COURSE(id),
               {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updateCourseData),
               }
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to update course")
          }

          const result = await res.json()
          toast.success(`Course "${result.courseName}" updated successfully`)
          return result
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update course"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Delete a course
 */
export const deleteCourse = async (id: string): Promise<void> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.DELETE_COURSE(id),
               {
                    method: "DELETE",
               }
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to delete course")
          }

          toast.success("Course deleted successfully")
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete course"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Get all sections
 */
export const getAllSections = async (): Promise<Section[]> => {
     try {
          const res = await authFetch(CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.GET_ALL_SECTIONS)

          if (!res.ok) {
               await handleApiError(res, "Failed to fetch sections")
          }

          return res.json()
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch sections"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Get sections by course
 */
export const getSectionsByCourse = async (courseId: string): Promise<Section[]> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.GET_SECTIONS_BY_COURSE(courseId)
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to fetch sections for course")
          }

          return res.json()
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch sections"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Create a new section
 */
export const createSection = async (
     courseId: string,
     newSectionData: Partial<Section>
): Promise<Section> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.CREATE_SECTION(courseId),
               {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newSectionData),
               }
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to create section")
          }

          const result = await res.json()
          toast.success(`Section "${result.sectionName}" created successfully`)
          return result
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to create section"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Bulk create sections
 */
export const bulkCreateSections = async (
     courseId: string,
     sections: BulkSectionRequest[]
): Promise<BulkSectionResult> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.CREATE_SECTIONS_BULK(courseId),
               {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(sections),
               }
          )

          const result: BulkSectionResult = await res.json()

          if (result.errorCount > 0 && result.successCount === 0) {
               toast.error(`Failed to create all sections (${result.errorCount} errors)`)
          } else if (result.errorCount > 0 && result.successCount > 0) {
               toast.warning(
                    `Partially successful: ${result.successCount} created, ${result.errorCount} failed`
               )
          } else {
               toast.success(`Successfully created ${result.successCount} section(s)`)
          }

          return result
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to create sections"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Update an existing section
 */
export const updateSection = async (
     id: string,
     updateSectionData: Partial<Section>
): Promise<Section> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.UPDATE_SECTION(id),
               {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updateSectionData),
               }
          )

          if (res.status === 304) {
               const text = await res.text()
               toast.info(text || "No changes detected")
               throw new Error("NOT_MODIFIED")
          }

          if (!res.ok) {
               await handleApiError(res, "Failed to update section")
          }

          const result = await res.json()
          toast.success(`Section "${result.sectionName}" updated successfully`)
          return result
     } catch (error) {
          if (error instanceof Error && error.message === "NOT_MODIFIED") {
               throw error
          }
          const errorMessage = error instanceof Error ? error.message : "Failed to update section"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Delete a section
 */
export const deleteSection = async (sectionId: string): Promise<void> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.DELETE_SECTION(sectionId),
               {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
               }
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to delete section")
          }

          toast.success("Section deleted successfully")
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete section"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Activate a section
 */
export const activateSection = async (sectionId: string): Promise<Section> => {
     try {
          const res = await authFetch(
               `${CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.GET_ALL_SECTIONS}/${sectionId}/activate`,
               {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
               }
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to activate section")
          }

          const result = await res.json()
          toast.success(`Section "${result.sectionName}" activated successfully`)
          return result
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to activate section"
          toast.error(errorMessage)
          throw error
     }
}
