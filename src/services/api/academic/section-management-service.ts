import { Section } from "@/interface/academic/section/SectionInterface"
import { toast } from "sonner"
import { authFetch } from "../../auth-fetch"
import { handleApiError } from "../utils/handle-api-error"
import { SECTION_MANAGEMENT_ENDPOINTS } from "@/constants/api"

interface BulkSectionRequest {
     sectionName: string
     yearLevel: number
     semester: number
}

interface BulkSectionError {
     index: number
     sectionName: string
     errorMessage: string
}

interface BulkSectionResult {
     successful: Section[]
     errors: BulkSectionError[]
     totalProcessed: number
     successCount: number
     errorCount: number
}

/**
 * Get all sections
 */
export const getAllSections = async (): Promise<Section[]> => {
     try {
          const res = await authFetch(SECTION_MANAGEMENT_ENDPOINTS.GET_ALL_SECTIONS)

          if (!res.ok) {
               await handleApiError(res, "Failed to fetch sections")
          }

          return res.json()
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch sections"
          toast.error("ERROR", {
               description: errorMessage,
          })
          throw error
     }
}

/**
 * Get sections by course
 */
export const getSectionsByCourse = async (courseId: string): Promise<Section[]> => {
     try {
          const res = await authFetch(SECTION_MANAGEMENT_ENDPOINTS.GET_SECTIONS_BY_COURSE(courseId))

          if (!res.ok) {
               await handleApiError(res, "Failed to fetch sections for course")
          }

          return res.json()
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch sections"
          toast.error("ERROR", {
               description: errorMessage,
          })
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
          const res = await authFetch(SECTION_MANAGEMENT_ENDPOINTS.CREATE_SECTIONS_BULK(courseId), {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(sections),
          })
          const result: BulkSectionResult = await res.json()
          if (result.errorCount > 0 && result.successCount === 0) {
               const errorDetails = result.errors
                    .slice(0, 3)
                    .map((err) => `Row ${err.index + 1} (${err.sectionName}): ${err.errorMessage}`)
                    .join("\n")

               const moreErrors =
                    result.errorCount > 3 ? `\n...and ${result.errorCount - 3} more errors` : ""

               toast.error("Failed to create sections", {
                    description: `${errorDetails}${moreErrors}`,
               })
          } else if (result.errorCount > 0 && result.successCount > 0) {
               const errorDetails = result.errors
                    .slice(0, 2)
                    .map((err) => `Row ${err.index + 1} (${err.sectionName}): ${err.errorMessage}`)
                    .join("\n")

               const moreErrors =
                    result.errorCount > 2 ? `\n...and ${result.errorCount - 2} more errors` : ""

               toast.warning("Partially successful", {
                    description: `${result.successCount} created, ${result.errorCount} failed\n${errorDetails}${moreErrors}`,
               })
          }

          return result
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to create sections"
          toast.error("Request failed", {
               description: errorMessage,
          })
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
          const res = await authFetch(SECTION_MANAGEMENT_ENDPOINTS.UPDATE_SECTION(id), {
               method: "PUT",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(updateSectionData),
          })

          if (res.status === 304) {
               const text = await res.text()
               toast.info(text || "No changes detected")
               throw new Error("NOT_MODIFIED")
          }

          if (!res.ok) {
               await handleApiError(res, "Failed to update section")
          }

          const result = await res.json()
          toast.success("SUCCESS", {
               description: `Section "${result.sectionName}" updated successfully`,
          })
          return result
     } catch (error) {
          if (error instanceof Error && error.message === "NOT_MODIFIED") {
               throw error
          }
          const errorMessage = error instanceof Error ? error.message : "Failed to update section"
          toast.error(errorMessage)
          toast.error("ERROR", {
               description: errorMessage,
          })
          throw error
     }
}

/**
 * Delete a section
 */
export const deleteSection = async (sectionId: string): Promise<void> => {
     try {
          const res = await authFetch(SECTION_MANAGEMENT_ENDPOINTS.DELETE_SECTION(sectionId), {
               method: "DELETE",
               headers: { "Content-Type": "application/json" },
          })

          if (!res.ok) {
               await handleApiError(res, "Failed to delete section")
          }
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete section"
          console.error(errorMessage)
          throw error
     }
}

/**
 * Activate a section
 */
export const activateSection = async (sectionId: string): Promise<Section> => {
     try {
          const res = await authFetch(
               `${SECTION_MANAGEMENT_ENDPOINTS.GET_ALL_SECTIONS}/${sectionId}/activate`,
               {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
               }
          )

          if (!res.ok) {
               await handleApiError(res, "Failed to activate section")
          }

          const result = await res.json()
          console.log(`Section "${result.sectionName}" activated successfully`)
          return result
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to activate section"
          console.error(errorMessage)
          throw error
     }
}
