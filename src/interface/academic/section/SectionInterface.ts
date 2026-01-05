import { Course } from "../course/CourseInterface"

export interface Section {
     id: string
     sectionName: string
     yearLevel?: number
     semester?: number
     isActive?: boolean
     course?: Course
     createdAt?: string | null
     updatedAt?: string | null
}
