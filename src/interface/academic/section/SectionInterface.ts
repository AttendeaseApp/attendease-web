import { Course } from "../course/CourseInterface"

export interface Section {
     id: string
     sectionName: string
     course?: Course
     createdAt?: string | null
     updatedAt?: string | null
}
