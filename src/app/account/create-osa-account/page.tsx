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
      <div className="w-64" />

      <main className="flex-1 p-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">
            Create a new OSA account
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Create a new user account here. Click register when you're done.
          </p>

          <Card className="shadow-md border-slate-200 bg-white/80 backdrop-blur">
            <CardContent className="p-8 space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div>
                <Label>Date of Birth</Label>
                <Input type="date" />
              </div>

              <div>
                <Label>Email Address</Label>
                <Input placeholder="Enter Onpassive Email ID" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Password</Label>
                  <Input type="password" placeholder="Password" />
                </div>
                <div>
                  <Label>Confirm Password</Label>
                  <Input type="password" placeholder="Confirm Password" />
                </div>
              </div>

              <div>
                <Label>Contact No.</Label>
                <Input placeholder="Contact No." />
              </div>

              <div className="flex justify-end">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6">
                  Register
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
