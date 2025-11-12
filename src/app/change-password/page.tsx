"use client"

import { useState } from "react"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { changePassword } from "@/services/OSA-change-password" 

export default function OsaChangePasswordPage() {
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" })
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [loading, setLoading] = useState(false)

    const router = useRouter()
        const  GoBackToProfilePage = async () => {
         router.push("/account")
        }
        
  const handleResetPassword = async () => {
    if (!passwords.oldPassword || !passwords.newPassword) {
      alert("Please fill out both fields.")
      return
    }


    setLoading(true)

    try {
      const result = await changePassword(passwords.oldPassword, passwords.newPassword)

      if (result.success) {
        alert(result.message)
        setPasswords({ oldPassword: "", newPassword: "" })
      } else {
        alert("Error: " + result.message)
      }
    } catch (err) {
      alert("Error: Something went wrong. " + String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedLayout>
      <div className="flex flex-col w-full h-full min-w-0 gap-6 p-6">
        <Label className="block mb-2 text-2xl font-bold text-slate-900">My Profile</Label>

        <div className="flex flex-col gap-6">
          <Label className="block text-xl font-semibold text-slate-900">Change Password</Label>

          <div className="flex flex-col gap-4 w-full max-w-3xl">

            {/* old password */}
            <div className="relative">
              <Label className="block font-semibold text-black mb-1">Old Password</Label>
              <Input
                type={showOld ? "text" : "password"}
                placeholder="Enter Old Password"
                value={passwords.oldPassword}
                onChange={(e) => setPasswords(prev => ({ ...prev, oldPassword: e.target.value }))}
                className="w-full pr-10 border border-sky-300 focus:border-sky-500"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showOld ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* new password */}
            <div className="relative">
              <Label className="block font-semibold text-black mb-1">New Password</Label>
              <Input
                type={showNew ? "text" : "password"}
                placeholder="Enter New Password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full pr-10 border border-sky-300 focus:border-sky-500"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* cancel and reset buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                className="rounded-sm bg-white text-black border border-slate-300"
                onClick={GoBackToProfilePage}
              >
                Cancel
              </Button>

              <Button
                className="rounded-sm"
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? "Updating..." : "Reset Password"}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
