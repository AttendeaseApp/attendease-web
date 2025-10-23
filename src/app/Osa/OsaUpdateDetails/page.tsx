"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export default function osaUpdateProfilePage() {
  const accountDetails = {
    id: "20210000",
    email: "john.doe@example.com",
    firstName: "John",
    middleName: "Cruz",
    lastName: "Doe",
    birthday: "",
    contact: "0123456789",
    userType: "OSA",
    address: "534 Spear Street San Francisco, CA 94105 United States",
    accountCreated: "25-06-2020",
  };

  const [date, setDate] = useState<Date | undefined>(new Date(accountDetails.birthday));

  return (
    <div className="min-h-screen p-8 font-sans bg-slate-50">
      {/* Page Title */}
      <Label className="block mb-4 text-xl font-semibold text-slate-900">
        My Profile
      </Label>

      {/* Name and Button */}
      <div className="flex items-center justify-between mb-0">
        <Label className="text-2xl font-semibold text-slate-800">
          {accountDetails.firstName} {accountDetails.middleName}{" "}
          {accountDetails.lastName}
        </Label>
        <Button className="rounded-sm">Change password</Button>
      </div>

      {/* Role under name */}
      <Label className="block mb-10 text-2xl text-slate-600">
        {accountDetails.userType}
      </Label>

      {/* Account Details Title */}
      <Label className="block mb-4 text-xl font-semibold text-slate-900">
        Account Details
      </Label>

      {/* Account Details */}
      <div className="flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <div>
            <Label className="block font-semibold text-black mb-1">User ID</Label>
            <Input
              defaultValue={accountDetails.id}
              className="border border-sky-300 focus:border-sky-500"
            />
          </div>
          <div>
            <Label className="block font-semibold text-black mb-1">Email Address</Label>
            <Input
              defaultValue={accountDetails.email}
              className="border border-sky-300 focus:border-sky-500"
            />
          </div>
          <div>
            <Label className="block font-semibold text-black mb-1">First Name</Label>
            <Input
              defaultValue={accountDetails.firstName}
              className="border border-sky-300 focus:border-sky-500"
            />
          </div>
          <div>
            <Label className="block font-semibold text-black mb-1">Middle Name</Label>
            <Input
              defaultValue={accountDetails.middleName}
              className="border border-sky-300 focus:border-sky-500"
            />
          </div>
          <div>
            <Label className="block font-semibold text-black mb-1">Last Name</Label>
            <Input
              defaultValue={accountDetails.lastName}
              className="border border-sky-300 focus:border-sky-500"
            />
          </div>

          {/* Date of Birth */}
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

          <div>
            <Label className="block font-semibold text-black mb-1">Contact Number</Label>
            <Input
              defaultValue={accountDetails.contact}
              className="border border-sky-300 focus:border-sky-500"
            />
          </div>
          <div>
            <Label className="block font-semibold text-black mb-1">User Type</Label>
            <Input
              defaultValue={accountDetails.userType}
              className="border border-sky-300 focus:border-sky-500"
            />
          </div>
          <div>
            <Label className="block font-semibold text-black mb-1">Address</Label>
            <Input
              defaultValue={accountDetails.address}
              className="border border-sky-300 focus:border-sky-500"
            />
          </div>
          <div>
            <Label className="block font-semibold text-black mb-1">Account Created</Label>
            <Input
              defaultValue={accountDetails.accountCreated}
              className="border border-sky-300 focus:border-sky-500"
            />
          </div>
        </div>

        {/* Bottom Right Button */}
        <div className="flex justify-end mt-6">
          <Button className="rounded-sm">Update</Button>
        </div>
      </div>
    </div>
  );
}
