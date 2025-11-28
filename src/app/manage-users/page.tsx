"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ChevronDown, Search } from "lucide-react"
import { UserStudentResponse } from "@/interface/UserStudent"
import { getAllUsers } from "@/services/user-management-services"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import UsersTable from "@/components/manage-users/UsersTable"
import MoreSettingsDialog from "@/components/manage-users/MoreSettingsDialog"
import ImportStudentsDialog from "@/components/manage-users/ImportStudentsDialog"

import { EditUserDetailsPayload } from "@/interface/users/edit-user-details"

import EditUserDetailsDialog from "@/components/manage-users/EditUserDetailsDialog"

import AddOSAAccountDialog from "@/components/manage-users/AddOSAAccountDialog"
import AddStudentAccountDialog from "@/components/manage-users/AddStudentAccountDialog"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function RetrieveAllUsers() {
     const [users, setUsers] = useState<UserStudentResponse[]>([])
     const [filteredUsers, setFilteredUsers] = useState<UserStudentResponse[]>([])
     const [loading, setLoading] = useState(true)
     const [searchTerm, setSearchTerm] = useState("")
     const [selectedType, setSelectedType] = useState("all")
     const [error, setError] = useState<string | null>(null)
     const [openMoreSettings, setOpenMoreSettings] = useState(false)
     const [openImportStudents, setOpenImportStudents] = useState(false)
     const [openAddOSA, setOpenAddOSA] = useState(false)
     const [openAddStudent, setOpenAddStudent] = useState(false)

     const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
     const [currentUser, setCurrentUser] = useState<EditUserDetailsPayload | null>(null)

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
          const lowerSearch = searchTerm.trim().toLowerCase()
          const searchWords = lowerSearch.split(" ").filter((w) => w)

          const filtered = users.filter((user) => {
               if (selectedType !== "all" && user.userType !== selectedType) {
                    return false
               }

               const fields = [
                    user.firstName,
                    user.lastName,
                    user.userType,
                    user.section,
                    user.course,
                    user.studentNumber,
                    user.email,
                    user.contactNumber,
                    user.accountStatus,
               ]

               return searchWords.every((sw) =>
                    fields.some((f) => (f?.toString().toLowerCase() || "").includes(sw))
               )
          })

          setFilteredUsers(filtered)
     }, [searchTerm, selectedType, users])

     const handleUpdateClick = (user: EditUserDetailsPayload) => {
          setCurrentUser(user)
          setOpenUpdateDialog(true)
     }
     const handleUserUpdated = (updatedUser: EditUserDetailsPayload) => {
          loadUsers()
          setOpenUpdateDialog(false)
     }

     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full h-full min-w-0 gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                         <div>
                              <h1 className="text-2xl font-bold md:text-3xl">Manage Users</h1>
                              <p className="text-muted-foreground mt-1">Manage all users here.</p>
                         </div>
                         <div className="flex justify-end space-x-2">
                              <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                        <Button>Manually Add Account ▾</Button>
                                   </DropdownMenuTrigger>

                                   <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => setOpenAddOSA(true)}>
                                             OSA Account
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setOpenAddStudent(true)}>
                                             Student Account
                                        </DropdownMenuItem>
                                   </DropdownMenuContent>
                              </DropdownMenu>

                              <Button
                                   className="sm:w-auto"
                                   onClick={() => setOpenImportStudents(true)}
                              >
                                   Import Student Accounts
                              </Button>
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
                              onValueChange={(value: string | undefined) =>
                                   setSelectedType(value || "all")
                              }
                              className="flex space-x-2"
                         >
                              <ToggleGroupItem value="all">ALL</ToggleGroupItem>
                              <ToggleGroupItem value="osa">OSA</ToggleGroupItem>
                              <ToggleGroupItem value="student">STUDENT</ToggleGroupItem>
                         </ToggleGroup>
                         <Button variant="outline" size="sm">
                              SECTION <ChevronDown className="ml-2 h-4 w-4" />
                         </Button>
                         <Button variant="outline" size="sm">
                              COURSE <ChevronDown className="ml-2 h-4 w-4" />
                         </Button>
                    </div>

                    <UsersTable
                         users={filteredUsers}
                         loading={loading}
                         onUpdate={handleUpdateClick}
                    />

                    {error && (
                         <div className="w-full max-w-6xl mx-auto mt-4 text-red-500">{error}</div>
                    )}
               </div>

               <MoreSettingsDialog open={openMoreSettings} onOpenChange={setOpenMoreSettings} />
               <ImportStudentsDialog
                    open={openImportStudents}
                    onOpenChange={setOpenImportStudents}
               />

               <EditUserDetailsDialog
                    open={openUpdateDialog}
                    onOpenChange={setOpenUpdateDialog}
                    user={currentUser}
                    onUpdated={handleUserUpdated}
                />
               <AddOSAAccountDialog
                    open={openAddOSA}
                    onOpenChange={setOpenAddOSA}
                    onAdd={loadUsers}
               />
               <AddStudentAccountDialog
                    open={openAddStudent}
                    onOpenChange={setOpenAddStudent}
                    onAdd={loadUsers}
               />
          </ProtectedLayout>
     )
}
