import { EligibilityCriteria } from "@/interface/event/event-interface"

export const formatEligibility = (criteria: EligibilityCriteria | null | undefined): string => {
     if (!criteria) return "Open to All"
     if (criteria.allStudents) return "All Students"
     const parts: string[] = []
     if (criteria.clusters?.length) {
          parts.push(`${criteria.clusters.length} Cluster${criteria.clusters.length > 1 ? "s" : ""}`)
     }
     if (criteria.courses?.length) {
          parts.push(`${criteria.courses.length} Course${criteria.courses.length > 1 ? "s" : ""}`)
     }
     if (criteria.sections?.length) {
          parts.push(
               `${criteria.sections.length} Section${criteria.sections.length > 1 ? "s" : ""}`
          )
     }
     return parts.length > 0 ? parts.join(" | ") : "No Restrictions"
}
