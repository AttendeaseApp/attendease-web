import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export default function LoginPage() {
  return (
    <div className={`flex h-screen ${poppins.className}`}>
      <div className="flex-[7] flex items-center justify-center bg-white">
        <Card className="w-full max-w-md p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-2">OSA Login</h1>
          <p className="text-gray-600 mb-6">Welcome back <br />Please enter your OSA credentials.</p>

          <div className="mb-4">
            <Label htmlFor="email">Email ID</Label>
            <Input id="email" type="email" placeholder="Enter Email ID" />
          </div>

          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Password" />
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

          <Button className="w-full mb-4">LOGIN</Button>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link href="#" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </Card>
      </div>

      <div className="flex-[3] bg-[#27548A] flex items-center justify-center">
      </div>
    </div>
  )
}
