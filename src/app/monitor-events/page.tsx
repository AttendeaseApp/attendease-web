"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { EventTable } from "@/components/monitor-events/EventTable"
import { AttendeesCard } from "@/components/monitor-events/AttendeesCard"

import { EventSession } from "@/interface/event/event-interface"
import { EventAttendeesResponse } from "@/interface/attendance/records/management/AttendeesResponse"
import { getAllEventsForMonitoring, getRegisteredAttendees } from "@/services/event-monitoring"

/**
 * EventMonitoringPage component for monitoring events with UPCOMING, REGISTRATION, and ONGOING statuses.
 *
 * @returns JSX.Element The EventMonitoringPage component.
 */
export default function EventMonitoringPage() {
     const [events, setEvents] = useState<EventSession[]>([])
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)
     const [searchTerm, setSearchTerm] = useState("")
     const [attendees, setAttendees] = useState<EventAttendeesResponse | null>(null)

     const loadEvents = async () => {
          try {
               setLoading(true)
               setError(null)
               const data = await getAllEventsForMonitoring()
               setEvents(data)
          } catch (err) {
               setError(err instanceof Error ? err.message : "Failed to load events")
          } finally {
               setLoading(false)
          }
     }

     const loadAttendees = async (eventId: string) => {
          try {
               setLoading(true)
               const data = await getRegisteredAttendees(eventId)
               setAttendees(data)
          } catch (err) {
               setError(err instanceof Error ? err.message : "Failed to load attendees")
          } finally {
               setLoading(false)
          }
     }

     useEffect(() => {
          loadEvents()
     }, [])

     const filteredEvents = events.filter((event) =>
          event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
     )

     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full h-full min-w-0 gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                         <div>
                              <h1 className="text-2xl font-bold md:text-3xl">Monitor Events</h1>
                              <p className="text-muted-foreground mt-1">
                                   Track the status of upcoming, registration, and ongoing events.
                              </p>
                         </div>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                         <div className="relative flex-1">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                   placeholder="Search events..."
                                   className="pl-8"
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                              />
                         </div>
                         <Button variant="outline" size="sm" onClick={loadEvents}>
                              Refresh
                         </Button>
                    </div>

                    {error && (
                         <div className="mt-4 p-4 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                              {error}
                         </div>
                    )}

                    <EventTable
                         events={filteredEvents}
                         onViewAttendees={loadAttendees}
                         loading={loading}
                    />
                    {attendees && <AttendeesCard attendeesData={attendees} />}
               </div>
          </ProtectedLayout>
     )
}
