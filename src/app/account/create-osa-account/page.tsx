import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateOSAAccountPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/60 border-r border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
            A
          </div>
          <div className="text-sm font-semibold">ATTENDEASE</div>
        </div>

        <nav className="space-y-2 text-slate-600 text-sm">
          <a
            href="/"
            className="block px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700"
          >
            Dashboard
          </a>
          <a
            href="/account/create-osa-account"
            className="block px-3 py-2 rounded-lg hover:bg-slate-100"
          >
            Manage Users
          </a>
          <a
            href="/account/create-student-account"
            className="block px-3 py-2 rounded-lg hover:bg-slate-100"
          >
            Manage Students
          </a>
          <a
            href="/account/import-student-account"
            className="block px-3 py-2 rounded-lg hover:bg-slate-100"
          >
            Import Students
          </a>
          <div className="mt-6 border-t pt-4 text-xs text-slate-400">OTHERS</div>
          <a
            href="#"
            className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            Settings
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            Accounts
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">
            Create a new OSA account
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Create new user account here. Click register when you're done.
          </p>

          <Card>
            <CardContent className="p-8 space-y-6">
              {/* User Type */}
              <div>
                <Label>Select User Type</Label>
                <Select defaultValue="OSA">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OSA">OSA</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input placeholder="Enter First Name" />
                </div>
                <div>
                  <Label>Middle Name</Label>
                  <Input placeholder="Enter Middle Name" />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input placeholder="Enter Last Name" />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <Label>Date of Birth</Label>
                <Input placeholder="dd/mm/yyyy" />
              </div>

              {/* Email */}
              <div>
                <Label>Email Address</Label>
                <Input placeholder="Enter Onpassive Email ID" />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Password</Label>
                  <Input type="password" placeholder="Password" />
                </div>
                <div>
                  <Label>Confirm Password</Label>
                  <Input type="password" placeholder="Confirm Password" />
                </div>
              </div>

              {/* Contact */}
              <div>
                <Label>Contact No.</Label>
                <Input placeholder="Contact No." />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button className="bg-black text-white">Register</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
