"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { Calendar, ArrowRight, Users, TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, CartesianGrid } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, } from "@/components/ui/chart"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"

const registeredStudents = 256

const totalEvents = 15

const cancelledEvents = 5

const totalAttendeesOnCurrentEvent = 190


const eventsChartOverview = [
     {
          eventId : "E001",
          eventName : "One-day League",
          totalVisit : 180,
     },
     {
          eventId : "E002",
          eventName : "Palarong Pinoy",
          totalVisit : 210,
     },
     {
          eventId : "E001",
          eventName : "Buwan ng Wika",
          totalVisit : 80,
     },
]


const chartConfig = {
  visits: {
    label: "Total Visits",
    color: "#000000",
  }
} satisfies ChartConfig


export default function DashboardPage() {
     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full h-full min-w-0 gap-6">
                    <div className="flex flex-col gap-2">
                         <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
                         <p className="text-muted-foreground">
                              Welcome to your dashboard overview.
                         </p>
                    </div>

                    {/* stats grid */}
                    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">

                         <Card>
                              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                   <CardTitle className="text-sm font-medium">
                                        Total Registered Students
                                   </CardTitle>
                                   <Users className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                   <div className="flex items-center gap-2">
                                        <div className="text-2xl font-bold">{registeredStudents}</div>
                                   </div>
                              </CardContent>
                         </Card>

                         <Card>
                              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                   <CardTitle className="text-sm font-medium">
                                        Total Events
                                   </CardTitle>
                                   <Calendar className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                   <div className="flex items-center gap-2">
                                        <div className="text-2xl font-bold">{totalEvents}</div>
                                   </div>
                              </CardContent>
                         </Card>

                         <Card>
                              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                   <CardTitle className="text-sm font-medium">
                                        Cancelled Events
                                   </CardTitle>
                                   <Calendar className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                   <div className="flex items-center gap-2">
                                        <div className="text-2xl font-bold">{cancelledEvents}</div>
                                   </div>
                              </CardContent>
                         </Card>

                         <Card>
                              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                   <CardTitle className="text-sm font-medium">
                                        Total Attendees on Current Event
                                   </CardTitle>
                                   <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                   <div className="flex items-center gap-2">
                                        <div className="text-2xl font-bold">{totalAttendeesOnCurrentEvent}</div>
                                   </div>
                              </CardContent>
                         </Card>
                    </div>

                    {/* event attendees chart */}
                    <Card>
                         <CardHeader>
                              <CardTitle>Attendees Overview</CardTitle>
                         </CardHeader>
                         <CardContent>
                              <ChartContainer config={chartConfig}>
                                   <BarChart accessibilityLayer data={eventsChartOverview}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis 
                                             dataKey="eventName"
                                             tickLine={false}
                                             tickMargin={10}
                                             axisLine={false}
                                             tickFormatter={(value) => value}
                                        />
                                   <Bar dataKey="totalVisit" fill="var(--color-totalVisit) " radius={4} />
                                   <ChartTooltip content={<ChartTooltipContent />} />
                                   <ChartLegend content={<ChartLegendContent />} />
                                   </BarChart>
                              </ChartContainer>
                         </CardContent>
                    </Card>

                    {/* few guides to help OSA manage the system */}
                    <Card>
                         <CardHeader>
                              <CardTitle>Attendease Guide</CardTitle>
                         </CardHeader>
                         <CardContent>
                              <div className="space-y-4">
                                   <p className="text-muted-foreground">
                                        Here are some guide to use the Attendease
                                   </p>
                              </div>
                              <Accordion type="single" collapsible>
                                   <AccordionItem value="item-1">
                                        <AccordionTrigger>How can I create an Event?</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                             Creating a New Event<br />
                                                  a. Go to <Link href="/manage-events" className="underline">Manage Events</Link> →
                                                       Create Event<br />
                                                  b. Fill in the required details:<br />
                                                       - Event Name<br />
                                                       - Description<br />
                                                       - Registration Start<br />
                                                       - Start and End Date & Time<br />
                                                       - Location<br />
                                                  c. Click Save and it should appear on the Event page
                                        </AccordionContent>
                                   </AccordionItem>
                              </Accordion>

                              <Accordion type="single" collapsible>
                                   <AccordionItem value="item-1">
                                        <AccordionTrigger>Can I add new Venue?</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                             Adding a New Venue<br/>
                                                  a. Go to <Link href="/manage-locations" className="underline">Manage Venues</Link> → 
                                                       Add New Location<br/>
                                                  b. Fill in the required details:<br/>
                                                       - Location Name<br/>
                                                       - Description of the Location: Indoor or Outdoor<br/>
                                                       - Choose whether to plot the location through Satellite or Open Street Map<br/>
                                                       - Plot the Location<br/>
                                                  c. Click Save and it should appear to the Venue page<br/>
                                        </AccordionContent>
                                   </AccordionItem>
                              </Accordion>

                              <Accordion type="single" collapsible>
                                   <AccordionItem value="item-1">
                                        <AccordionTrigger>How can I add new users?</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                             Adding New User<br/>
                                                  a. Go to <Link href="/manage-users" className="underline">Manage Users</Link> → 
                                                       Manually Add Account or Import Student Accounts to simplify user account management<br/>
                                                  b. For Manually adding of student account, just fill in the required details:<br/>
                                                       - Student Full Name<br/>
                                                       - Student Number<br/>
                                                       - Cluster<br/>
                                                       - Course<br/>
                                                       - Email<br/>
                                                       - Contact Number<br/>
                                                  c. Click Save and it should appear to the Users page<br/>
                                        </AccordionContent>
                                   </AccordionItem>
                              </Accordion>
                         </CardContent>
                    </Card>
               </div>
          </ProtectedLayout>
     )
}
