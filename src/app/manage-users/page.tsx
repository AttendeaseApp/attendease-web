"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ChevronDown, Search } from "lucide-react"
import { UserStudentResponse } from "@/interface/UserStudent"
import { getAllUsers, deleteStudentAccountBySection } from "@/services/user-management-services"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function RetrieveAllUsers() {
     const [users, setUsers] = useState<UserStudentResponse[]>([])
     const [filteredUsers, setFilteredUsers] = useState<UserStudentResponse[]>([])
     const [loading, setLoading] = useState(true)
     const [searchTerm, setSearchTerm] = useState("")
     const [selectedType, setSelectedType] = useState("all")
     const [selectedSection, setSelectedSection] = useState<string | null>(null)
     const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
     const [sections, setSections] = useState<string[]>([])
     const [courses, setCourses] = useState<string[]>([])
     const [error, setError] = useState<string | null>(null)

     const [openMoreSettings, setOpenMoreSettings] = useState(false)
     const [openImportStudents, setOpenImportStudents] = useState(false)
     const [openAddOSA, setOpenAddOSA] = useState(false)
     const [openAddStudent, setOpenAddStudent] = useState(false)
     const [openDeleteModal, setOpenDeleteModal] = useState(false)
     const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
     const [currentUser, setCurrentUser] = useState<EditUserDetailsPayload | null>(null)
     const [confirmDeleteSection, setConfirmDeleteSection] = useState<string | null>(null)
     const [deleting, setDeleting] = useState(false)
     const [deleteResult, setDeleteResult] = useState<{ success: boolean; message: string } | null>(
          null
     )

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

     useEffect(() => {
          const uniqueSections = Array.from(new Set(users.map((u) => u.section || "N/A")))
          setSections(uniqueSections)

          const uniqueCourses = Array.from(new Set(users.map((u) => u.course || "N/A")))
          setCourses(uniqueCourses)
     }, [users])

     // SEARCH and FILTERING
     useEffect(() => {
          const lowerSearch = searchTerm.trim().toLowerCase()
          const searchWords = lowerSearch.split(" ").filter(Boolean)

          const filtered = users.filter((user) => {
               if (selectedType !== "all" && user.userType?.toLowerCase() !== selectedType)
                    return false

               const userSection = user.section || "N/A"
               const userCourse = user.course || "N/A"

               if (selectedSection && userSection !== selectedSection) return false
               if (selectedCourse && userCourse !== selectedCourse) return false

               const fields = [
                    user.firstName,
                    user.lastName,
                    user.userType,
                    userSection,
                    userCourse,
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
     }, [searchTerm, selectedType, selectedSection, selectedCourse, users])

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
                                   placeholder="Search users..."
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
                              onValueChange={(value) => setSelectedType(value || "all")}
                              className="flex space-x-2"
                         >
                              <ToggleGroupItem value="all">ALL</ToggleGroupItem>
                              <ToggleGroupItem value="osa">OSA</ToggleGroupItem>
                              <ToggleGroupItem value="student">STUDENT</ToggleGroupItem>
                         </ToggleGroup>

                         <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                   <Button variant="outline" size="sm">
                                        SECTION <ChevronDown className="ml-2 h-4 w-4" />
                                   </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                   {sections.map((sec) => (
                                        <DropdownMenuItem
                                             key={sec}
                                             onClick={() => setSelectedSection(sec)}
                                        >
                                             {sec}
                                        </DropdownMenuItem>
                                   ))}
                                   <DropdownMenuItem onClick={() => setSelectedSection(null)}>
                                        All Sections
                                   </DropdownMenuItem>
                              </DropdownMenuContent>
                         </DropdownMenu>

                         <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                   <Button variant="outline" size="sm">
                                        COURSE <ChevronDown className="ml-2 h-4 w-4" />
                                   </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                   {courses.map((c) => (
                                        <DropdownMenuItem
                                             key={c}
                                             onClick={() => setSelectedCourse(c)}
                                        >
                                             {c}
                                        </DropdownMenuItem>
                                   ))}
                                   <DropdownMenuItem onClick={() => setSelectedCourse(null)}>
                                        All Courses
                                   </DropdownMenuItem>
                              </DropdownMenuContent>
                         </DropdownMenu>
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

               <MoreSettingsDialog
                    open={openMoreSettings}
                    onOpenChange={setOpenMoreSettings}
                    setOpenDeleteModal={setOpenDeleteModal}
               />

               <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
                    <DialogContent className="max-w-md w-full">
                         <DialogHeader>
                              <DialogTitle>Delete Account by Section</DialogTitle>
                         </DialogHeader>

                         <div className="flex flex-col gap-2 max-h-64 overflow-y-auto mt-4">
                              {sections.length === 0 && <p>No sections available.</p>}
                              {sections.map((sec) => (
                                   <Button
                                        key={sec}
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                             setConfirmDeleteSection(sec)
                                        }}
                                   >
                                        {sec}
                                   </Button>
                              ))}
                         </div>

                         <Button
                              variant="ghost"
                              className="mt-4 w-full"
                              onClick={() => setOpenDeleteModal(false)}
                         >
                              Cancel
                         </Button>
                    </DialogContent>
               </Dialog>

               <Dialog
                    open={!!confirmDeleteSection}
                    onOpenChange={() => setConfirmDeleteSection(null)}
               >
                    <DialogContent className="max-w-md w-full">
                         <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                         </DialogHeader>

                         <p className="mt-2 text-sm text-gray-600">
                              Are you sure you want to delete all users in section{" "}
                              <span className="font-semibold">{confirmDeleteSection}</span>? This
                              action cannot be undone.
                         </p>

                         <div className="flex justify-end gap-2 mt-4">
                              <Button
                                   variant="outline"
                                   onClick={() => setConfirmDeleteSection(null)}
                                   disabled={deleting}
                              >
                                   Cancel
                              </Button>
                              <Button
                                   className="bg-red-500 text-white"
                                   onClick={async () => {
                                        if (!confirmDeleteSection) return
                                        try {
                                             setDeleting(true)
                                             const sectionToDelete =
                                                  confirmDeleteSection === "N/A"
                                                       ? ""
                                                       : confirmDeleteSection
                                             await deleteStudentAccountBySection(sectionToDelete)
                                             loadUsers()

                                             setDeleteResult({
                                                  success: true,
                                                  message: `All users in section "${confirmDeleteSection}" have been successfully deleted.`,
                                             })
                                             setConfirmDeleteSection(null)
                                             setOpenDeleteModal(false)
                                             setOpenMoreSettings(false)
                                        } catch (err) {
                                             setDeleteResult({
                                                  success: false,
                                                  message: `Failed to delete users in section "${confirmDeleteSection}": ${err instanceof Error ? err.message : "Unknown error"}`,
                                             })
                                             setConfirmDeleteSection(null)
                                             setOpenDeleteModal(false)
                                             setOpenMoreSettings(false)
                                        } finally {
                                             setDeleting(false)
                                        }
                                   }}
                                   disabled={deleting}
                              >
                                   {deleting ? "Deleting..." : "Delete"}
                              </Button>
                         </div>
                    </DialogContent>
               </Dialog>

               <Dialog
                    open={!!deleteResult}
                    onOpenChange={() => {
                         setDeleteResult(null)
                         setConfirmDeleteSection(null)
                    }}
               >
                    <DialogContent className="max-w-sm w-full">
                         <DialogHeader>
                              <DialogTitle>
                                   {deleteResult?.success ? "Success" : "Failed"}
                              </DialogTitle>
                         </DialogHeader>

                         <p
                              className={`mt-2 text-sm font-semibold ${deleteResult?.success ? "text-green-600" : "text-red-600"}`}
                         >
                              {deleteResult?.message}
                         </p>

                         <div className="flex justify-end mt-4">
                              <Button
                                   onClick={() => {
                                        setDeleteResult(null)
                                        setConfirmDeleteSection(null)
                                        setOpenDeleteModal(false)
                                        setOpenMoreSettings(false)
                                   }}
                              >
                                   OK
                              </Button>
                         </div>
                    </DialogContent>
               </Dialog>

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
