"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw, X, AlertCircle } from "lucide-react"
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
     const [loadingAttendees, setLoadingAttendees] = useState(false)
     const [selectedEventName, setSelectedEventName] = useState<string>("")

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

     const loadAttendees = async (eventId: string, eventName: string) => {
          try {
               setLoadingAttendees(true)
               setError(null)
               const data = await getRegisteredAttendees(eventId)
               setAttendees(data)
               setSelectedEventName(eventName)
          } catch (err) {
               setError(err instanceof Error ? err.message : "Failed to load attendees")
               setAttendees(null)
               setSelectedEventName("")
          } finally {
               setLoadingAttendees(false)
          }
     }

     useEffect(() => {
          loadEvents()
     }, [])

     useEffect(() => {
          if (events.length > 0) {
               const first = events[0]
               loadAttendees(first.eventId, first.eventName)
          } else {
               setAttendees(null)
               setSelectedEventName("")
          }
     }, [events])

     const filteredEvents = events.filter((event) => {
          const term = searchTerm.toLowerCase()

          const fields = [
               event.eventName,
               event.registrationLocationName,
               event.venueLocationName,
               new Date(event.registrationDateTime).toLocaleString(),
               new Date(event.startingDateTime).toLocaleString(),
               new Date(event.endingDateTime).toLocaleString(),
               event.eventStatus,
          ]

          return fields.some((value) => value?.toString().toLowerCase().includes(term))
     })

     useEffect(() => {
          if (filteredEvents.length === 0) {
               setAttendees(null)
               setSelectedEventName("")
          }
     }, [filteredEvents])

     const clearSearch = () => {
          setSearchTerm("")
     }

     const closeAttendees = () => {
          setAttendees(null)
          setSelectedEventName("")
     }

     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full h-full min-w-0 gap-6">
                    <div>
                         <h1 className="text-2xl font-semibold md:text-3xl">Event Monitoring</h1>
                         <p className="text-sm text-muted-foreground mt-1">
                              Track the status of upcoming, registration, and ongoing events.
                         </p>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                         <div className="relative flex-1">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                   placeholder="Search events..."
                                   className="pl-8"
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                              />
                              {searchTerm && (
                                   <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1 h-7 w-7"
                                        onClick={clearSearch}
                                   >
                                        <X className="h-4 w-4" />
                                   </Button>
                              )}
                         </div>
                         <Button variant="outline" size="icon" onClick={loadEvents} title="Refresh">
                              <RefreshCw className="h-4 w-4" />
                         </Button>
                    </div>

                    {error && (
                         <div className="flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                              <AlertCircle className="h-4 w-4 shrink-0" />
                              <span>{error}</span>
                         </div>
                    )}

                    {attendees && selectedEventName && (
                         <AttendeesCard
                              attendeesData={attendees}
                              eventName={selectedEventName}
                              onClose={closeAttendees}
                              loading={loadingAttendees}
                         />
                    )}

                    <div>
                         <EventTable
                              events={filteredEvents}
                              onViewAttendees={loadAttendees}
                              loading={loading}
                         />
                    </div>
               </div>
          </ProtectedLayout>
     )
}
