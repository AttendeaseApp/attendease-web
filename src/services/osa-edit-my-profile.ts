import { OSA_PROFILE_ENDPOINT } from "@/constants/api"
import { OsaEditMyProfileInterface } from "@/interface/my-profile/OsaEditMyProfileInterface";

export const editMyProfile = async (
    information: Partial<OsaEditMyProfileInterface>
): Promise<{ success: boolean; message?: string }> => {
     try {
          const token = localStorage.getItem("authToken")
          if (!token) {
               return { success: false, message: "User is not authenticated." }
          }

          const res = await fetch(OSA_PROFILE_ENDPOINT.OSA_EDIT_MY_PROFILE, {
               method: "PATCH",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify(information),
          })

          const data = await res.json()

          if (res.ok) {
               return { success: true, message: data.message || "Profile updated successfully" }
          } else {
               return { success: false, message: data.message || "Failed to update profile" }
          }
     } catch (error) {
          console.error("Error updating profile", error)
          throw error
     }
}
