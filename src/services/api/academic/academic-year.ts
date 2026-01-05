import { authFetch } from "@/services/auth-fetch"
import { CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS } from "@/constants/api"
import { toast } from "sonner"

export interface SemesterInfo {
     number: number
     name: string
     startDate: string
     endDate: string
     durationDays: number
     active: boolean
}

export interface AcademicYear {
     id: string
     academicYearName: string
     currentSemester: SemesterInfo | null
     firstSemester: SemesterInfo
     secondSemester: SemesterInfo
     status: string
     daysUntilStart: number | null
     daysUntilEnd: number | null
     totalDays: number
     daysElapsed: number | null
     active: boolean
     progressPercentage: number | null
     createdAt: string
     updatedAt: string
}

export interface CreateAcademicYearRequest {
     academicYearName: string
     firstSemesterStart: string
     firstSemesterEnd: string
     secondSemesterStart: string
     secondSemesterEnd: string
}

export interface UpdateAcademicYearRequest {
     academicYearName?: string
     firstSemesterStart?: string
     firstSemesterEnd?: string
     secondSemesterStart?: string
     secondSemesterEnd?: string
}

export interface SemesterStatus {
     isFirstSemesterActive: boolean
     isSecondSemesterActive: boolean
     currentSemester: number | string
     currentSemesterName: string | null
}

interface ErrorResponse {
     message?: string
     error?: string
     details?: string
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
                    errorBody.message || errorBody.error || errorBody.details || defaultMessage
          } else {
               const textError = await res.text()
               if (textError && textError.trim()) {
                    errorMessage = textError
               }
          }
     } catch (parseError) {
          console.error("Failed to parse error response:", parseError)
     }

     throw new Error(errorMessage)
}

/**
 * Trigger academic year activation scheduler
 */
export const triggerAcademicYearActivation = async (): Promise<{
     status: string
     message: string
}> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.TRIGGER_ACADEMIC_SCHEDULER,
               {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
               }
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to trigger academic year activation")
          }

          const result = await res.json()
          return result
     } catch (error) {
          const errorMessage =
               error instanceof Error ? error.message : "An unexpected error occurred"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Fetch the currently active academic year
 */
export const getActiveAcademicYear = async (): Promise<AcademicYear> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.GET_ACTIVE_ACADEMIC_YEAR
          )

          if (!res.ok) {
               await handleApiError(res, "No active academic year found")
          }

          return res.json()
     } catch (error) {
          const errorMessage =
               error instanceof Error ? error.message : "Failed to fetch active academic year"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Fetch all academic years (active and inactive)
 */
export const getAllAcademicYears = async (): Promise<AcademicYear[]> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.GET_ALL_ACADEMIC_YEARS
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to fetch academic years")
          }

          return res.json()
     } catch (error) {
          const errorMessage =
               error instanceof Error ? error.message : "Failed to fetch academic years"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Fetch a specific academic year by ID
 */
export const getAcademicYearById = async (id: string): Promise<AcademicYear> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.GET_ACADEMIC_YEAR_BY_ID(id)
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to fetch academic year")
          }

          return res.json()
     } catch (error) {
          const errorMessage =
               error instanceof Error ? error.message : "Failed to fetch academic year"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Create a new academic year
 */
export const createAcademicYear = async (
     payload: CreateAcademicYearRequest
): Promise<AcademicYear> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.CREATE_ACADEMIC_YEAR,
               {
                    method: "POST",
                    body: JSON.stringify(payload),
               }
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to create academic year")
          }

          const result = await res.json()
          toast.success(`Academic year "${result.academicYearName}" created successfully`)
          return result
     } catch (error) {
          const errorMessage =
               error instanceof Error ? error.message : "Failed to create academic year"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Update an existing academic year
 */
export const updateAcademicYear = async (
     id: string,
     payload: UpdateAcademicYearRequest
): Promise<AcademicYear> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.UPDATE_ACADEMIC_YEAR(id),
               {
                    method: "PUT",
                    body: JSON.stringify(payload),
               }
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to update academic year")
          }

          const result = await res.json()
          return result
     } catch (error) {
          const errorMessage =
               error instanceof Error ? error.message : "Failed to update academic year"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Delete an academic year by ID
 */
export const deleteAcademicYear = async (id: string): Promise<void> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.DELETE_ACADEMIC_YEAR(id),
               {
                    method: "DELETE",
               }
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to delete academic year")
          }
     } catch (error) {
          const errorMessage =
               error instanceof Error ? error.message : "Failed to delete academic year"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Activate a specific academic year by ID
 */
export const activateAcademicYear = async (id: string): Promise<AcademicYear> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.ACTIVATE_ACADEMIC_YEAR(id),
               {
                    method: "PUT",
               }
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to activate academic year")
          }

          const result = await res.json()
          toast.success(`Academic year "${result.academicYearName}" activated successfully`)
          return result
     } catch (error) {
          const errorMessage =
               error instanceof Error ? error.message : "Failed to activate academic year"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Deactivate a specific academic year by ID
 */
export const deactivateAcademicYear = async (id: string): Promise<AcademicYear> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.DEACTIVATE_ACADEMIC_YEAR(id),
               {
                    method: "PATCH",
               }
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to deactivate academic year")
          }

          const result = await res.json()
          toast.success(`Academic year "${result.academicYearName}" deactivated successfully`)
          return result
     } catch (error) {
          const errorMessage =
               error instanceof Error ? error.message : "Failed to deactivate academic year"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Get the current semester number (1 or 2)
 */
export const getCurrentSemester = async (): Promise<number | null> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.GET_CURRENT_SEMESTER
          )

          if (res.status === 204) return null

          if (!res.ok) {
               await handleApiError(res, "Failed to fetch current semester")
          }

          const data = await res.json()
          return data.currentSemester
     } catch (error) {
          const errorMessage =
               error instanceof Error ? error.message : "Failed to fetch current semester"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Get the current semester name
 */
export const getCurrentSemesterName = async (): Promise<string | null> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.GET_CURRENT_SEMESTER_NAME
          )

          if (res.status === 204) return null

          if (!res.ok) {
               await handleApiError(res, "Failed to fetch current semester name")
          }

          const data = await res.json()
          return data.currentSemesterName
     } catch (error) {
          const errorMessage =
               error instanceof Error ? error.message : "Failed to fetch current semester name"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Get semester status information
 */
export const getSemesterStatus = async (): Promise<SemesterStatus> => {
     try {
          const res = await authFetch(
               CLUSTER_AND_COURSE_MANAGEMENT_API_ENDPOINTS.GET_SEMESTER_STATUS
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to fetch semester status")
          }

          return res.json()
     } catch (error) {
          const errorMessage =
               error instanceof Error ? error.message : "Failed to fetch semester status"
          toast.error(errorMessage)
          throw error
     }
}
