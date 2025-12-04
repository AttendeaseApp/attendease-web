import { Cluster } from "../cluster/ClusterInterface"

export interface Course {
     id: string
     courseName: string
     cluster?: Cluster
     createdByUserId?: string | null
     updatedByUserId?: string | null
     createdAt?: string | null
     updatedAt?: string | null
}
