"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ChevronDown, Search } from "lucide-react"
import { UserStudentResponse } from "@/interface/user-interface"
import { getAllUsers } from "@/services/user-management-services"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import UsersTable from "@/components/manage-users/UsersTable"
import MoreSettingsDialog from "@/components/manage-users/MoreSettingsDialog"

export default function RetrieveAllUsers() {
  const [users, setUsers] = useState<UserStudentResponse[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserStudentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [error, setError] = useState<string | null>(null)
  const [openMoreSettings, setOpenMoreSettings] = useState(false)

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllUsers()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users")
      console.error("Error loading users:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // SEARCH and FILTERING
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase()

    const filtered = users.filter((user) => {
      const matchesSearch =
        user.firstName?.toLowerCase().includes(lowerSearch) ||
        user.lastName?.toLowerCase().includes(lowerSearch) ||
        user.email?.toLowerCase().includes(lowerSearch) ||
        user.course?.toLowerCase().includes(lowerSearch) ||
        user.studentNumber?.toLowerCase().includes(lowerSearch)

      const matchesType =
        selectedType === "all" || user.userType?.toLowerCase() === selectedType.toLowerCase()

      return matchesSearch && matchesType
    })

    setFilteredUsers(filtered)
  }, [searchTerm, selectedType, users])

  return (
    <ProtectedLayout>
      <div className="flex flex-col w-full h-full min-w-0 gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Manage Users</h1>
            <p className="text-muted-foreground mt-1">Manage all users here.</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button className="sm:w-autom">Manually Add Account</Button>
            <Button className="sm:w-auto">Import Student Accounts</Button>
            <Button
              variant="outline"
              className="sm:w-auto"
              onClick={() => setOpenMoreSettings(true)}
            >
              More Settings <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
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
          <Button variant="outline" size="sm" onClick={loadUsers}>
            Refresh
          </Button>

          <ToggleGroup
            type="single"
            value={selectedType}
            onValueChange={(value: string | undefined) => setSelectedType(value || "all")}
            className="flex space-x-2"
          >
            <ToggleGroupItem value="all">ALL</ToggleGroupItem>
            <ToggleGroupItem value="osa">OSA</ToggleGroupItem>
            <ToggleGroupItem value="student">STUDENT</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <Button variant="outline" className="rounded-sm">
            GRADE LEVEL <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="rounded-sm">
            SECTION <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="rounded-sm">
            COURSE <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="rounded-sm">
            ACCOUNT STATUS <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <UsersTable users={filteredUsers} loading={loading} />

        {error && <div className="w-full max-w-6xl mx-auto mt-4 text-red-500">{error}</div>}
      </div>

      <MoreSettingsDialog open={openMoreSettings} onOpenChange={setOpenMoreSettings} />
    </ProtectedLayout>
  )
}
