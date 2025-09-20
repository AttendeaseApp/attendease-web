import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function osaProfilePage() {
  const accountDetails = {
    id: "20210000",
    email: "john.doe@example.com",
    firstName: "John",
    middleName: "Cruz",
    lastName: "Doe",
    birthday: "06/12/1990",
    contact: "0123456789",
    userType: "OSA",
    address: "534 Spear Street San Francisco, CA 94105 United States",
    accountCreated: "25-06-2020",
  };

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
        <Button className="rounded-sm">Update Account Details</Button>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        <div>
          <Label className="block font-semibold text-sky-600 mb-1">User ID</Label>
          <Label className="block text-base text-slate-800">{accountDetails.id}</Label>
        </div>
        <div>
          <Label className="block font-semibold text-sky-600 mb-1">Email Address</Label>
          <Label className="block text-base text-slate-800">{accountDetails.email}</Label>
        </div>
        <div>
          <Label className="block font-semibold text-sky-600 mb-1">First Name</Label>
          <Label className="block text-base text-slate-800">{accountDetails.firstName}</Label>
        </div>
        <div>
          <Label className="block font-semibold text-sky-600 mb-1">Middle Name</Label>
          <Label className="block text-base text-slate-800">{accountDetails.middleName}</Label>
        </div>
        <div>
          <Label className="block font-semibold text-sky-600 mb-1">Last Name</Label>
          <Label className="block text-base text-slate-800">{accountDetails.lastName}</Label>
        </div>
        <div>
          <Label className="block font-semibold text-sky-600 mb-1">Date of Birth</Label>
          <Label className="block text-base text-slate-800">{accountDetails.birthday}</Label>
        </div>
        <div>
          <Label className="block font-semibold text-sky-600 mb-1">Contact Number</Label>
          <Label className="block text-base text-slate-800">{accountDetails.contact}</Label>
        </div>
        <div>
          <Label className="block font-semibold text-sky-600 mb-1">User Type</Label>
          <Label className="block text-base text-slate-800">{accountDetails.userType}</Label>
        </div>
        <div>
          <Label className="block font-semibold text-sky-600 mb-1">Address</Label>
          <Label className="block text-base text-slate-800">{accountDetails.address}</Label>
        </div>
        <div>
          <Label className="block font-semibold text-sky-600 mb-1">Account Created</Label>
          <Label className="block text-base text-slate-800">{accountDetails.accountCreated}</Label>
        </div>
      </div>
    </div>
  );
}
