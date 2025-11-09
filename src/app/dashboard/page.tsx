"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { Calendar, Users, ArrowUpRight, Bell } from "lucide-react"

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <div className="flex flex-col w-full h-full min-w-0 gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your dashboard overview.</p>
        </div>

        {/* stats grid */}
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">12</div>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-xs text-muted-foreground">+2.1%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">3</div>
                <span className="text-xs text-muted-foreground">This week</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* recent events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">No recent events to display.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
