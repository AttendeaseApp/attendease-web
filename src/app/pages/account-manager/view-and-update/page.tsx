"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"


export default function ViewAndUpdate() {
  const [activeSection, setActiveSection] = useState("account");

  const accountDetails = {
    id: "20210000",
    email: "john.doe@example.com",
    firstName: "John",
    middleName: "Cruz",
    lastName: "Doe",
    birthday: "",
    contact: "0123456789",
    userType: "STUDENT",
    address: "534 Spear Street San Francisco, CA 94105 United States",
    accountCreated: "25-06-2020",
    status: "ACTIVE",
  };

      const [date, setDate] = useState<Date | undefined>(new Date(accountDetails.birthday));

  const ChangePassword ={
    oldPassword: "",
    newPassword:"",
    confirmPassword:"",
  }


  return (
    <div className="min-h-screen p-8 font-sans bg-slate-50">
      {/* Name header */}
      <div className="flex items-center justify-between mb-0">
        <Label className="text-2xl font-semibold text-slate-800">
          Update Account for {accountDetails.firstName} {accountDetails.middleName}{" "}
          {accountDetails.lastName}
        </Label>
      </div>

      <Label className="block mb-4 text-slate-600">
        Make changes to this account here. Click save when you are done.
      </Label>

    <ToggleGroup type="single" value={activeSection} onValueChange={(value: string | null) => {
    if (value) setActiveSection(value); }}
        className="flex space-x-2"
>
  <ToggleGroupItem value="account">ACCOUNT</ToggleGroupItem>
  <ToggleGroupItem value="facial">FACIAL DATA</ToggleGroupItem>
  <ToggleGroupItem value="password">PASSWORD</ToggleGroupItem>
</ToggleGroup>

      {/* ACCOUNT Section */}
      {activeSection === "account" && (
        <div className="flex flex-col space-y-4">
          {/* Row 1 inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
            <div>
              <Label className="block font-semibold text-black mb-1">User ID</Label>
              <Input defaultValue={accountDetails.id} className="border border-sky-300 focus:border-sky-500" />
            </div>
            <div>
              <Label className="block font-semibold text-black mb-1">User Type</Label>
              <Input defaultValue={accountDetails.userType} className="border border-sky-300 focus:border-sky-500" />
            </div>
            <div>
              <Label className="block font-semibold text-black mb-1">Email Address</Label>
              <Input defaultValue={accountDetails.email} className="border border-sky-300 focus:border-sky-500" />
            </div>
            <div>
              <Label className="block font-semibold text-black mb-1">Account Status</Label>
              <Input defaultValue={accountDetails.status} className="border border-sky-300 focus:border-sky-500" />
            </div>
          </div>

          {/* Row 2 inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <div>
              <Label className="block font-semibold text-black mb-1">First Name</Label>
              <Input defaultValue={accountDetails.firstName} className="border border-sky-300 focus:border-sky-500" />
            </div>
            <div>
              <Label className="block font-semibold text-black mb-1">Middle Name</Label>
              <Input defaultValue={accountDetails.middleName} className="border border-sky-300 focus:border-sky-500" />
            </div>
            <div>
              <Label className="block font-semibold text-black mb-1">Last Name</Label>
              <Input defaultValue={accountDetails.lastName} className="border border-sky-300 focus:border-sky-500" />
            </div>
          </div>

           {/* Row 3 input */}
           <div>
            <Label className="block font-semibold text-black mb-1">Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border border-sky-300 focus:border-sky-500"
                >
                  {date
                    ? date.toLocaleDateString()
                    : accountDetails.birthday}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Row 4 input */}
          <div>
            <Label className="block font-semibold text-black mb-1">Contact Number</Label>
            <Input defaultValue={accountDetails.contact} className="border border-sky-300 focus:border-sky-500" />
          </div>

          {/* Row 5 inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <Label className="block font-semibold text-black mb-1">Address</Label>
              <Input defaultValue={accountDetails.address} className="border border-sky-300 focus:border-sky-500" />
            </div>
            <div>
              <Label className="block font-semibold text-black mb-1">Joined Date</Label>
              <Input defaultValue={accountDetails.accountCreated} className="border border-sky-300 focus:border-sky-500" />
            </div>
          </div>

          {/* confirm and deact buttons */}
          <div className="flex justify-end mt-6 space-x-2">
              <Button className="rounded-sm">Confirm Changes </Button>
              <Button variant="outline" className="rounded-sm bg-white text-black border border-slate-300">Deactivate Account</Button>
        
          </div>
        </div>
      )}

      {/* FACIAL DATA Section */}
      {activeSection === "facial" && (
        <div className="flex flex-col space-y-4">
<Button
  variant="outline"
  className="flex flex-col items-start justify-center gap-1 rounded-md bg-white text-red-500 mt-9 py-4 px-6 h-auto"
>
  <span className="text-sm font-semibold leading-none">
    Permanently Delete Facial Data
  </span>
  <span className="text-xs text-black leading-tight">
  This action cannot be undone. This will permanently delete all facial data from our database. The student will be required to registered its facial data again. 
  </span>
</Button>


          
        </div>
        
      )}

      {/* PASSWORD Section */}
      {activeSection === "password" && (
        <div className="flex flex-col space-y-4">
          <div className="space-y-4">
        <div>
          <Label className="block font-semibold text-black mb-1">Old Password</Label>
          <Input
            defaultValue={ChangePassword.oldPassword}
            className="w-full border border-sky-300 focus:border-sky-500"  type="password" placeholder="Enter Old Password"
          />
        </div>
        <div>
          <Label className="block font-semibold text-black mb-1">New Password</Label>
          <Input
            defaultValue={ChangePassword.newPassword}
            className="w-full border border-sky-300 focus:border-sky-500" type="password" placeholder="Enter New Password"
          />
        </div>
        <div>
          <Label className="block font-semibold text-black mb-1">Confirm Password</Label>
          <Input
            defaultValue={ChangePassword.confirmPassword}
            className="w-full border border-sky-300 focus:border-sky-500"  type="password" placeholder="Enter Confirm Password"
          />
        </div>
        {/* cancel and reset password buttons */}
        <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" className="rounded-sm bg-white text-black border border-slate-300"> Cancel</Button>
        <Button className="rounded-sm">Reset Password</Button>
      </div>
      </div>
        </div>
      )}
    </div>
  );
}