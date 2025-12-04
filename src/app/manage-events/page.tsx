"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { EventTable } from "@/components/manage-events/EventTable"
import { Input } from "@/components/ui/input"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { Plus, Search } from "lucide-react"
import { getAllEvents } from "@/services/event-sessions"
import { deleteEvent } from "@/services/event-sessions"
import { EventSession } from "@/interface/event/event-interface"
import { EditEventDialog } from "@/components/manage-events/EditEventDialog"
import { CreateEventDialog } from "@/components/manage-events/CreateEventDialog"
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

/**
 * ManageEventsPage component for managing event sessions(CREATE, READ, UPDATE, DELETE).
 *
 * @returns JSX.Element The ManageEventsPage component.
 */
export default function ManageEventsPage() {
     const [events, setEvents] = useState<EventSession[]>([])
     const [loading, setLoading] = useState(true)
     const [searchTerm, setSearchTerm] = useState("")
     const [isEditOpen, setIsEditOpen] = useState(false)
     const [selectedEvent, setSelectedEvent] = useState<EventSession | null>(null)
     const [isCreateOpen, setIsCreateOpen] = useState(false)
     const [statusFilter, setStatusFilter] = useState("all")

     const loadEvents = async () => {
          try {
               setLoading(true)
               const data = await getAllEvents()
               setEvents(data)
          } catch (err) {
               const errorMessage = err instanceof Error ? err.message : "Failed to load events"
               toast.error(errorMessage)
               console.error("Error loading events:", err)
          } finally {
               setLoading(false)
          }
     }

     useEffect(() => {
          loadEvents()
     }, [])

     const filteredEvents = events.filter((event) => {
          const term = searchTerm.toLowerCase()

          const matchesSearch =
               event.eventName.toLowerCase().includes(term) ||
               event.eventLocation?.locationName?.toLowerCase().includes(term) ||
               new Date(event.timeInRegistrationStartDateTime)
                    .toLocaleString()
                    .toLowerCase()
                    .includes(term) ||
               new Date(event.startDateTime).toLocaleString().toLowerCase().includes(term) ||
               new Date(event.endDateTime).toLocaleString().toLowerCase().includes(term) ||
               event.eventStatus.toLowerCase().includes(term)

          const matchesStatus =
               statusFilter === "all" ||
               event.eventStatus.toLowerCase() === statusFilter.toLowerCase()

          return matchesSearch && matchesStatus
     })

     const handleEdit = (event: EventSession) => {
          setSelectedEvent(event)
          setIsEditOpen(true)
     }

     const handleEditClose = () => {
          setIsEditOpen(false)
          setSelectedEvent(null)
     }

     const handleEditUpdate = () => {
          setIsEditOpen(false)
          setSelectedEvent(null)
          loadEvents()
          toast.success("Event updated successfully!")
     }

     const handleCreateOpen = () => setIsCreateOpen(true)
     const handleCreateClose = () => setIsCreateOpen(false)
     const handleCreateSuccess = () => {
          setIsCreateOpen(false)
          loadEvents()
          toast.success("Event created successfully!")
     }

     const handleDelete = async (event: EventSession) => {
          try {
               await deleteEvent(event.eventId)
               setEvents((prev) => prev.filter((e) => e.eventId !== event.eventId))
               toast.success("Event deleted successfully!")
          } catch (error) {
               console.error("Delete failed:", error)
               toast.error("Failed to delete event." + error)
          }
     }

     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full h-full min-w-0 gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                         <div>
                              <h1 className="text-2xl font-bold md:text-3xl">Manage Events</h1>
                              <p className="text-muted-foreground mt-1">
                                   View, schedule, and edit all event details.
                              </p>
                         </div>
                         <Button className="sm:w-auto" onClick={handleCreateOpen}>
                              <Plus className="mr-2 h-4 w-4" />
                              Create Event
                         </Button>
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
                         <Select
                              value={statusFilter}
                              onValueChange={(value) => setStatusFilter(value)}
                         >
                              <SelectTrigger>
                                   <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                   <SelectItem value="all">All Status</SelectItem>
                                   <SelectItem value="upcoming">Upcoming</SelectItem>
                                   <SelectItem value="ongoing">Ongoing</SelectItem>
                                   <SelectItem value="finalized">Finalized</SelectItem>
                                   <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                         </Select>

                         <Button variant="outline" size="sm" onClick={loadEvents}>
                              Refresh
                         </Button>
                    </div>
                    <EventTable
                         events={filteredEvents}
                         loading={loading}
                         onEdit={handleEdit}
                         onDelete={handleDelete}
                    />

                    {selectedEvent && (
                         <EditEventDialog
                              event={selectedEvent}
                              isOpen={isEditOpen}
                              onClose={handleEditClose}
                              onUpdate={handleEditUpdate}
                         />
                    )}

                    <CreateEventDialog
                         isOpen={isCreateOpen}
                         onClose={handleCreateClose}
                         onCreate={handleCreateSuccess}
                    />
               </div>
          </ProtectedLayout>
     )
}
