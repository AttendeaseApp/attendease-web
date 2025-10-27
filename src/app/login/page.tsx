"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Poppins } from "next/font/google";
import { login } from "@/services/auth"; 

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); /** page redirection */

  /** login function */
  const handleLogin = async () => {
    /** checks if email and pass is not empty */
    if (!email || !password) {
      alert("Please fill in both email and password.");
      return;
    }

    setLoading(true); /** disables the button while logging in */
    try {
      /** calls the API using fetch (via services/auth.ts) */
      const response = await login(email, password); /** endpoint handled in login() */

      console.log("Login response:", response);

      /** gets the user info and token from response */
      const token = typeof response === "string" ? response : response.token;
      const user = typeof response === "string" ? null : response.user;

      /** saves token to use for next API calls */
      localStorage.setItem("token", token);

      /** alert and redirect after successful login */
      alert(`Welcome, ${user?.name || "OSA user"}!`);
      router.push("/dashboard");
    } catch (error: any) {
      /** shows error message if incorrect credentials or error in backend */
      console.error(error.message);
      alert("Invalid email or password.");
    } finally {
      setLoading(false); /** enable the button again */
    }
  };

  return (
    <div className={`flex h-screen ${poppins.className}`}>
      <div className="flex-[7] flex items-center justify-center bg-white">
        <Card className="w-full max-w-md p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-2">OSA Login</h1>
          <p className="text-gray-600 mb-6">
            Welcome back <br />Please enter your OSA credentials.
          </p>

          <div className="mb-4">
            <Label htmlFor="email">Email ID</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4 relative">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Link href="#" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button
            className="w-full mb-4"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </Button>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link href="#" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </Card>
      </div>

      <div className="flex-[3] bg-[#27548A] flex items-center justify-center" />
    </div>
  );
}
