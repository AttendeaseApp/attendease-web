export interface CourseSession {
  id: string
  courseName: string
  cluster?:  
    {
        clusterId: string
        clusterName: string
        createdAt?: string | null
        updatedAt?: string | null
    } 
    | null
  createdByUserId?: string | null
  updatedByUserId?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface ClusterSession {
    clusterId: string
    clusterName: string
    createdAt?: string | null
    updatedAt?: string | null
}