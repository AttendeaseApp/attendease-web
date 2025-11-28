import { USER_MANAGEMENT_API_ENDPOINTS } from "@/constants/api"
import { EditUserDetailsPayload } from "@/interface/users/edit-user-details"
import { authFetch } from "./auth-fetch"

export async function updateUser(
     userId: string,
     payload: Omit<EditUserDetailsPayload, "userId">
): Promise<EditUserDetailsPayload> {
     const res = await authFetch(USER_MANAGEMENT_API_ENDPOINTS.EDIT_USER_DETAILS(userId), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
     })

     if (!res.ok) {
          const errorData = await res.json().catch(() => null)
          throw new Error(errorData?.message || "Failed to update user")
     }

     const data: EditUserDetailsPayload = await res.json()
     return data
}
