import { EligibilityCriteria } from "@/interface/event/event-interface"

export const formatEligibility = (criteria: EligibilityCriteria | null | undefined): string => {
     if (!criteria) return "Open to All"

     if (criteria.allStudents) return "All Students"

     const parts: string[] = []

     if (criteria.cluster?.length) {
          parts.push(`${criteria.cluster.length} Cluster${criteria.cluster.length > 1 ? "s" : ""}`)
     }
     if (criteria.course?.length) {
          parts.push(`${criteria.course.length} Course${criteria.course.length > 1 ? "s" : ""}`)
     }
     if (criteria.sections?.length) {
          parts.push(`${criteria.sections.length} Course${criteria.sections.length > 1 ? "s" : ""}`)
     }

     return parts.length > 0 ? parts.join(" | ") : "No Restrictions"
}
