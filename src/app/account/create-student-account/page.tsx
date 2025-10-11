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

export default function CreateStudentAccountPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="w-64" />

      <main className="flex-1 p-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">
            Create a new STUDENT account
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Fill out student information then click register.
          </p>

          <Card className="shadow-md border-slate-200 bg-white/80 backdrop-blur">
            <CardContent className="p-8 space-y-6">
              <div>
                <Label>Select User Type</Label>
                <Select defaultValue="Student">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="OSA">OSA</SelectItem>
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
                <Label>Student Number</Label>
                <Input placeholder="Enter Student Number" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Section</Label>
                  <Input placeholder="Enter Section" />
                </div>
                <div>
                  <Label>Year Level</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Year Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Contact No.</Label>
                <Input placeholder="Contact No." />
              </div>

              <div>
                <Label>Email Address</Label>
                <Input type="email" placeholder="Enter Email" />
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
