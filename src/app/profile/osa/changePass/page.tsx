import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function osaChangePasswordPage() {
  const password = {
    oldPassword: "",
    newPassword:"",
    reTypeNewPassword:"",
  };

  return (
    <div className="min-h-screen p-8 font-sans bg-slate-50">
      {/* Page Title */}
      <Label className="block mb-15 text-xl font-semibold text-slate-900">
        My Profile
      </Label>

      {/* Change Password Title */}
      <Label className="block mb-4 text-xl font-semibold text-slate-900">
        Change Password
      </Label>

      {/* Input */}
      <div className="space-y-4">
        <div>
          <Label className="block font-semibold text-black mb-1">Old Password</Label>
          <Input
            defaultValue={password.newPassword}
            className="w-full border border-sky-300 focus:border-sky-500"
          />
        </div>
        <div>
          <Label className="block font-semibold text-black mb-1">New Password</Label>
          <Input
            defaultValue={password.newPassword}
            className="w-full border border-sky-300 focus:border-sky-500"
          />
        </div>
        <div>
          <Label className="block font-semibold text-black mb-1">Confirm Password</Label>
          <Input
            defaultValue={password.reTypeNewPassword}
            className="w-full border border-sky-300 focus:border-sky-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" className="rounded-sm bg-white text-black border border-slate-300">
          Cancel
        </Button>
        <Button className="rounded-sm">Reset Password</Button>
      </div>
    </div>
  );
}
