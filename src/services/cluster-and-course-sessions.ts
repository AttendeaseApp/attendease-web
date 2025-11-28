import { CourseSession } from "@/interface/cluster-and-course-interface"
import { Section } from "@/interface/students/SectionInterface"
import { ClusterSession } from "@/interface/cluster-and-course-interface"
import { authFetch } from "./auth-fetch"
import { CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS } from "@/constants/api"

export const getAllCourses = async (): Promise<CourseSession[]> => {
     try {
          const res = await authFetch(CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.GET_ALL_COURSES)
          if (!res.ok) {
               throw new Error("Failed to fetch courses: ${res.status}")
          }
          const data = await res.json()
          return data as CourseSession[]
     } catch (error) {
          console.error("Error fetching courses:", error)
          throw error
     }
}

export const getAllClusters = async (): Promise<ClusterSession[]> => {
     try {
          const res = await authFetch(CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.GET_ALL_CLUSTERS)
          if (!res.ok) {
               throw new Error(`Failed to fetch clusters: ${res.status}`)
          }
          const data = await res.json()
          return data as ClusterSession[]
     } catch (error) {
          console.error("Error fetching clusters:", error)
          throw error
     }
}

export const getAllSections = async (): Promise<Section[]> => {
     try {
          const res = await authFetch(CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.GET_ALL_SECTIONS)
          if (!res.ok) {
               throw new Error(`Failed to fetch sections: ${res.status}`)
          }
          const data = await res.json()
          return data as Section[]
     } catch (error) {
          console.error("Error fetching sections:", error)
          throw error
     }
}

export const getSectionsByCourse = async (courseId: string): Promise<Section[]> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.GET_SECTIONS_BY_COURSE(courseId)
          )
          if (!res.ok) {
               throw new Error(`Failed to fetch sections for course: ${res.status}`)
          }
          const data = await res.json()
          return data as Section[]
     } catch (error) {
          console.error("Error fetching sections by course:", error)
          throw error
     }
}

export const deleteCourse = async (id: string): Promise<void> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.DELETE_COURSE(id),
               {
                    method: "DELETE",
               }
          )
          if (!res.ok) {
               let errorMsg = `Failed to delete course: ${res.status}`
               try {
                    const errorBody = await res.json()
                    errorMsg =
                         errorBody.error ||
                         errorBody.message ||
                         (Array.isArray(errorBody.errors)
                              ? errorBody.errors[0]?.defaultMessage
                              : errorBody)
               } catch (parseErr) {
                    errorMsg = res.statusText || errorMsg + parseErr
               }
               throw new Error(errorMsg)
          }
     } catch (error) {
          console.error("Error deleting course:", error)
          throw error
     }
}

export const createCluster = async (
     newClusterData: Partial<ClusterSession>
): Promise<ClusterSession> => {
     try {
          const payload = { ...newClusterData }
          const res = await authFetch(CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.CREATE_CLUSTER, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(payload),
          })

          if (!res.ok) {
               let errorMsg = `Failed to create cluster: ${res.status}`
               try {
                    const errorBody = await res.json()
                    errorMsg =
                         errorBody.error ||
                         errorBody.message ||
                         (Array.isArray(errorBody.errors)
                              ? errorBody.errors[0]?.defaultMessage
                              : errorBody)
               } catch (parseErr) {
                    errorMsg = res.statusText || errorMsg + parseErr
               }
               throw new Error(errorMsg)
          }

          const data = await res.json()
          return data as ClusterSession
     } catch (error) {
          console.error("Error creating cluster:", error)
          throw error
     }
}

export const createCourse = async (
     id: string,
     newCourseData: Partial<CourseSession>
): Promise<CourseSession> => {
     try {
          const payload = { ...newCourseData }
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.CREATE_COURSE(id),
               {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
               }
          )

          if (!res.ok) {
               let errorMsg = `Failed to create course: ${res.status}`
               try {
                    const errorBody = await res.json()
                    errorMsg =
                         errorBody.error ||
                         errorBody.message ||
                         (Array.isArray(errorBody.errors)
                              ? errorBody.errors[0]?.defaultMessage
                              : errorBody)
               } catch (parseErr) {
                    errorMsg = res.statusText || errorMsg + parseErr
               }
               throw new Error(errorMsg)
          }

          const data = await res.json()
          return data as CourseSession
     } catch (error) {
          console.error("Error creating course:", error)
          throw error
     }
}

export const deleteCluster = async (id: string): Promise<void> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.DELETE_CLUSTER(id),
               {
                    method: "DELETE",
               }
          )
          if (!res.ok) {
               let errorMsg = `Failed to delete course: ${res.status}`
               try {
                    const errorBody = await res.json()
                    errorMsg =
                         errorBody.error ||
                         errorBody.message ||
                         (Array.isArray(errorBody.errors)
                              ? errorBody.errors[0]?.defaultMessage
                              : errorBody)
               } catch (parseErr) {
                    errorMsg = res.statusText || errorMsg + parseErr
               }
               throw new Error(errorMsg)
          }
     } catch (error) {
          console.error("Error deleting course:", error)
          throw error
     }
}
