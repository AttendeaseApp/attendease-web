import { USER_MANAGEMENT_API_ENDPOINTS } from "@/constants/api"
import { UpdateUserDetailsInterface } from "@/interface/management/update/UpdateUserDetailsInterface"
import { authFetch } from "./auth-fetch"

export async function updateUser(
     userId: string,
     payload: Omit<UpdateUserDetailsInterface, "userId">
): Promise<UpdateUserDetailsInterface> {
     const res = await authFetch(USER_MANAGEMENT_API_ENDPOINTS.EDIT_USER_DETAILS(userId), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
     })

     if (!res.ok) {
          const errorData = await res.json().catch(() => null)

          if (errorData?.details) {
               const detailedMessage = Object.values(errorData.details).join(", ")
               throw new Error(detailedMessage)
          }
          throw new Error(errorData?.message || "Failed to update user")
     }

     const data: UpdateUserDetailsInterface = await res.json()
     return data
}
