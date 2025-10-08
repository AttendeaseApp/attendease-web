"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function ViewAndUpdate() {
  const [activeSection, setActiveSection] = useState("account");

  const accountDetails = {
    id: "20210000",
    email: "john.doe@example.com",
    firstName: "John",
    middleName: "Cruz",
    lastName: "Doe",
    birthday: "06/12/1990",
    contact: "0123456789",
    userType: "STUDENT",
    address: "534 Spear Street San Francisco, CA 94105 United States",
    accountCreated: "25-06-2020",
    status: "ACTIVE",
  };

  const ChangePassword ={
    oldPassword: "",
    newPassword:"",
    confirmPassword:"",
  }

  return (
    <div className="min-h-screen p-8 font-sans bg-slate-50">
      {/* Name Section */}
      <div className="flex items-center justify-between mb-0">
        <Label className="text-2xl font-semibold text-slate-800">
          Update Account for {accountDetails.firstName} {accountDetails.middleName}{" "}
          {accountDetails.lastName}
        </Label>
      </div>

      <Label className="block mb-4 text-slate-600">
        Make changes to this account here. Click save when you're done.
      </Label>

      {/* Toggle Group */}
      <div className="mb-6">
        <ToggleGroup
          type="single"
          value={activeSection}
          onValueChange={(value) => setActiveSection(value)}
          className="flex space-x-2"
        >
          <ToggleGroupItem value="account">ACCOUNT</ToggleGroupItem>
          <ToggleGroupItem value="facial">FACIAL DATA</ToggleGroupItem>
          <ToggleGroupItem value="password">PASSWORD</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* ACCOUNT Section */}
      {activeSection === "account" && (
        <div className="flex flex-col space-y-4">
          {/* Row 1 - 4 inputs */}
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

          {/* Row 2 - 3 inputs */}
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

          {/* Row 3 - 1 input */}
          <div>
            <Label className="block font-semibold text-black mb-1">Date of Birth</Label>
            <Input defaultValue={accountDetails.birthday} className="border border-sky-300 focus:border-sky-500" />
          </div>

          {/* Row 4 - 1 input */}
          <div>
            <Label className="block font-semibold text-black mb-1">Contact Number</Label>
            <Input defaultValue={accountDetails.contact} className="border border-sky-300 focus:border-sky-500" />
          </div>

          {/* Row 5 - 2 inputs */}
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

          {/* Update Button */}
          <div className="flex justify-end mt-6 space-x-2">
              <Button className="rounded-sm">
          Confirm Changes
        </Button>
        <Button variant="outline" className="rounded-sm bg-white text-black border border-slate-300">Deactivate Account</Button>
        
          </div>
        </div>
      )}

      {/* FACIAL DATA Section */}
      {activeSection === "facial" && (
        <div className="flex flex-col space-y-4">
            
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
            className="w-full border border-sky-300 focus:border-sky-500"placeholder="Enter Old Password"
          />
        </div>
        <div>
          <Label className="block font-semibold text-black mb-1">New Password</Label>
          <Input
            defaultValue={ChangePassword.newPassword}
            className="w-full border border-sky-300 focus:border-sky-500"placeholder="Enter New Password"
          />
        </div>
        <div>
          <Label className="block font-semibold text-black mb-1">Confirm Password</Label>
          <Input
            defaultValue={ChangePassword.confirmPassword}
            className="w-full border border-sky-300 focus:border-sky-500"placeholder="Enter Confirm Password"
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" className="rounded-sm bg-white text-black border border-slate-300">
          Cancel
        </Button>
        <Button className="rounded-sm">Reset Password</Button>
      </div>
      </div>
        </div>
      )}
    </div>
  );
}
