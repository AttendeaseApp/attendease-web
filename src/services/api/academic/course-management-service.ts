import { authFetch } from "@/services/auth-fetch"
import { Course } from "@/interface/academic/course/CourseInterface"
import { handleApiError } from "../utils/handle-api-error"
import { toast } from "sonner"
import { COURSE_MANAGEMENT_SERVICE_ENDPOINTS } from "@/constants/api"

/**
 * Get all courses
 */
export const getAllCourses = async (): Promise<Course[]> => {
     try {
          const res = await authFetch(COURSE_MANAGEMENT_SERVICE_ENDPOINTS.GET_ALL_COURSES)

          if (!res.ok) {
               await handleApiError(res, "Failed to fetch courses")
          }

          return res.json()
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch courses"
          toast.error("ERROR", {
               description: errorMessage,
          })
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
               COURSE_MANAGEMENT_SERVICE_ENDPOINTS.CREATE_COURSE(clusterId),
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
          toast.success("SUCCESS", {
               description: `Course "${result.courseName}" created successfully`,
          })
          return result
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to create course"
          toast.error("ERROR", {
               description: errorMessage,
          })
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
          const res = await authFetch(COURSE_MANAGEMENT_SERVICE_ENDPOINTS.UPDATE_COURSE(id), {
               method: "PATCH",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(updateCourseData),
          })

          if (!res.ok) {
               await handleApiError(res, "Failed to update course")
          }

          const result = await res.json()
          toast.success("SUCCESS", {
               description: `Course "${result.courseName}" updated successfully`,
          })
          return result
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update course"
          toast.error("ERROR", {
               description: errorMessage,
          })
          throw error
     }
}

/**
 * Delete a course
 */
export const deleteCourse = async (id: string): Promise<void> => {
     try {
          const res = await authFetch(COURSE_MANAGEMENT_SERVICE_ENDPOINTS.DELETE_COURSE(id), {
               method: "DELETE",
          })

          if (!res.ok) {
               await handleApiError(res, "Failed to delete course")
          }
          toast.success("SUCCESS", {
               description: "Course deleted successfully",
          })
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete course"
          toast.error("ERROR", {
               description: errorMessage,
          })
          throw error
     }
}
