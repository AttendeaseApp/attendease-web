"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EventTable } from "@/components/manage-events/EventTable"
import { Input } from "@/components/ui/input"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { Plus, Search } from "lucide-react"
import { getAllEvents } from "@/services/event-sessions"
import { deleteEvent } from "@/services/event-sessions"
import { EventSession } from "@/interface/event-interface"
import { EditEventDialog } from "@/components/manage-events/EditEventDialog"
import { CreateEventDialog } from "@/components/manage-events/CreateEventDialog"

export default function ManageEventsPage() {
  const [events, setEvents] = useState<EventSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventSession | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllEvents()
      setEvents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events")
      console.error("Error loading events:", err)
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
  }

  const handleCreateOpen = () => setIsCreateOpen(true)
  const handleCreateClose = () => setIsCreateOpen(false)
  const handleCreateSuccess = () => {
    setIsCreateOpen(false)
    loadEvents()
  }

  const handleDelete = async (event: EventSession) => {
    try {
      await deleteEvent(event.eventId)
      setEvents((prev) => prev.filter((e) => e.eventId !== event.eventId))
      alert("Event deleted successfully!")
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Failed to delete event. Please try again.")
    }
  }

  return (
    <ProtectedLayout>
      <div className="flex flex-col w-full h-full min-w-0 gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Manage Events</h1>
            <p className="text-muted-foreground mt-1">Create and manage your events here.</p>
          </div>
          <Button className="sm:w-auto" onClick={handleCreateOpen}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Events</CardTitle>
          </CardHeader>
          <CardContent>
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
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>

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
