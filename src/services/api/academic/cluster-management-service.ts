import { authFetch } from "@/services/auth-fetch"
import { CLUSTER_MANAGEMENT_SERVICE_ENDPOINTS } from "@/constants/api"
import { Cluster } from "@/interface/academic/cluster/ClusterInterface"
import { handleApiError } from "../utils/handle-api-error"
import { toast } from "sonner"

/**
 * Get all clusters
 */
export const getAllClusters = async (): Promise<Cluster[]> => {
     try {
          const res = await authFetch(CLUSTER_MANAGEMENT_SERVICE_ENDPOINTS.GET_ALL_CLUSTERS)

          if (!res.ok) {
               await handleApiError(res, "Failed to fetch clusters")
          }

          return res.json()
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch clusters"
          toast.error(errorMessage)
          throw error
     }
}

/**
 * Create a new cluster
 */
export const createCluster = async (newClusterData: Partial<Cluster>): Promise<Cluster> => {
     const res = await authFetch(CLUSTER_MANAGEMENT_SERVICE_ENDPOINTS.CREATE_CLUSTER, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newClusterData),
     })
     if (!res.ok) {
          await handleApiError(res, "Failed to create cluster")
     }
     return await res.json()
}

/**
 * Update an existing cluster
 */
export const updateCluster = async (
     id: string,
     updateClusterData: Partial<Cluster>
): Promise<Cluster> => {
     try {
          const res = await authFetch(CLUSTER_MANAGEMENT_SERVICE_ENDPOINTS.UPDATE_CLUSTER(id), {
               method: "PUT",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(updateClusterData),
          })

          if (!res.ok) {
               await handleApiError(res, "Failed to update cluster")
          }

          const result = await res.json()
          toast.success("SUCCESS", {
               description: `Cluster "${result.clusterName}" updated successfully`,
          })
          return result
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update cluster"
          toast.error("ERROR", {
               description: errorMessage,
          })
          throw error
     }
}

/**
 * Delete a cluster
 */
export const deleteCluster = async (id: string): Promise<void> => {
     try {
          const res = await authFetch(CLUSTER_MANAGEMENT_SERVICE_ENDPOINTS.DELETE_CLUSTER(id), {
               method: "DELETE",
          })

          if (!res.ok) {
               await handleApiError(res, "Failed to delete cluster")
          }

          toast.success("SUCCESS", {
               description: "Successfully deleted cluster",
          })
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete cluster"
          toast.warning("WARNING", {
               description: errorMessage,
          })
          throw error
     }
}
