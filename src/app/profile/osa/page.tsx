import { Button } from "@/components/ui/button";

export default function Page() {
  const user = {
    id: "20210000",
    email: "john.doe@example.com",
    firstName: "John",
    middleName: "Colsum",
    lastName: "Doe",
    birthday: "06/12/1990",
    contact: "0123456789",
    userType: "OSA",
    address: "534 Spear Street San Francisco, CA 94105 United States",
    accountCreated: "25-06-2020",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        background: "#f8fafc",
      }}
    >
      {/* Page Title */}
      <h1 style={{ marginBottom: "1rem", fontSize: 20 }}>My Profile</h1>

      {/* Name + Button in same row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.25rem",
        }}
      >
        <h2>
          {user.firstName} {user.middleName} {user.lastName}
        </h2>
        <Button style={{borderRadius:5}}>Update Account Details</Button>
      </div>

      {/* Role under name */}
      <p style={{ marginBottom: "2rem", color: "#475569" }}>{user.userType}</p>

      {/* Account Details */}
      <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>
        Account Details
      </h3>

      {/* First Row */}
      <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
        <p>
          <strong>User ID:</strong> {user.id}
        </p>
        <p>
          <strong>Email Address:</strong> {user.email}
        </p>
      </div>

      {/* Second Row */}
      <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
        <p>
          <strong>First Name:</strong> {user.firstName}
        </p>
        <p>
          <strong>Middle Name:</strong> {user.middleName}
        </p>
        <p>
          <strong>Last Name:</strong> {user.lastName}
        </p>
      </div>

      {/* Third Row */}
      <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
        <p>
          <strong>Date of Birth:</strong> {user.birthday}
        </p>
        <p>
          <strong>Contact Number:</strong> {user.contact}
        </p>
        <p>
          <strong>User Type:</strong> {user.userType}
        </p>
      </div>

      {/* Last Row → Address + Account Created on the same line */}
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <p>
          <strong>Address:</strong> {user.address}
        </p>
        <p>
          <strong>Account Created:</strong> {user.accountCreated}
        </p>
      </div>
    </div>
  );
}
