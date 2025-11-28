export interface Section {
     id: string
     name: string
     course?: {
          id: string
          courseName: string
     } | null
     createdAt?: string | null
     updatedAt?: string | null
}
