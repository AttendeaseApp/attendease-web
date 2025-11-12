import { OSA_PROFILE_ENDPOINT } from "@/constants/api"

export const changePassword = async (
     oldPassword: string,
     newPassword: string
): Promise<{ success: boolean; message?: string }> => {
     try {
          const token = localStorage.getItem("authToken")
          if (!token) {
               return { success: false, message: "User is not authenticated." }
          }

          const res = await fetch(OSA_PROFILE_ENDPOINT.OSA_CHANGE_PASSWORD, {
               method: "PATCH",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({ oldPassword, newPassword }),
          })

          const responseText = await res.text()

          if (res.ok) {
               return { success: true, message: responseText || "Password updated successfully" }
          } else {
               return { success: false, message: responseText || "Failed to update password" }
          }
     } catch (error) {
          console.error("Error updating password", error)
          throw error
     }
}
