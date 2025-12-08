"use client"

import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import CreateOsaAccountDialog from "@/components/manage-users/dialogs/createUser/CreateOsaAccountDialog"
import CreateStudentAccountDialog from "@/components/manage-users/dialogs/createUser/CreateStudentAccountDialog"
import EditUserDetailsDialog from "@/components/manage-users/dialogs/editUser/EditOsaDetailsDialog"
import EditStudentDetailsDialog from "@/components/manage-users/dialogs/editUser/EditStudentDetailsDialog"
import ImportStudentsDialog from "@/components/manage-users/dialogs/importStudent/ImportStudentsDialog"
import MoreSettingsDialog from "@/components/manage-users/dialogs/settings/MoreSettingsDialog"
import ManagingUsersTable from "@/components/manage-users/table/ManagingUsersTable"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { UpdateUserDetailsInterface } from "@/interface/management/update/UpdateUserDetailsInterface"
import { UserStudentResponse } from "@/interface/UserStudent"
import {
     deleteStudentAccountBySection,
     getAllUsers,
} from "@/services/api/user/management/user-management-services"
import { ChevronDown, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function RetrieveAllUsers() {
     const [users, setUsers] = useState<UserStudentResponse[]>([])
     const [filteredUsers, setFilteredUsers] = useState<UserStudentResponse[]>([])
     const [loading, setLoading] = useState(true)
     const [searchTerm, setSearchTerm] = useState("")
     const [selectedType, setSelectedType] = useState("all")
     const [selectedSection, setSelectedSection] = useState<string | null>(null)
     const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
     const [courses, setCourses] = useState<string[]>([])
     const [sections, setSections] = useState<string[]>([])
     const [currentUser, setCurrentUser] = useState<UpdateUserDetailsInterface | null>(null)
     const [deleting, setDeleting] = useState(false)

     const [currentPage, setCurrentPage] = useState(1)
     const [dialogState, setDialogState] = useState({
          moreSettings: false,
          importStudents: false,
          addOSA: false,
          addStudent: false,
          deleteModal: false,
          confirmDelete: null as string | null,
          deleteResult: null as { success: boolean; message: string } | null,
          updateUser: false,
          updateStudent: false,
     })

     const itemsPerPage = 10
     const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
     const paginatedUsers = filteredUsers.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
     )
     const getTypeDisplay = (type: string) => {
          switch (type) {
               case "all":
                    return "ALL"
               case "osa":
                    return "OSA"
               case "student":
                    return "STUDENT"
               default:
                    return "ALL"
          }
     }
     const loadUsers = async () => {
          try {
               setLoading(true)
               const data = await getAllUsers()
               setUsers(data)
          } catch (err) {
               const message = err instanceof Error ? err.message : "Failed to load users"
               console.error(message)
               toast.error(message)
          } finally {
               setLoading(false)
          }
     }

     useEffect(() => {
          loadUsers()
     }, [])

     useEffect(() => {
          const uniqueSections = Array.from(
               new Set(users.map((u) => u.section).filter((s): s is string => !!s))
          )
          const uniqueCourses = Array.from(
               new Set(users.map((u) => u.course).filter((c): c is string => !!c))
          )

          setSections(["All Sections", ...uniqueSections])
          setCourses(["All Courses", ...uniqueCourses])
     }, [users])

     useEffect(() => {
          const lowerSearch = searchTerm.trim().toLowerCase()
          const searchWords = lowerSearch.split(" ").filter(Boolean)

          const filtered = users.filter((user) => {
               if (selectedType !== "all" && user.userType?.toLowerCase() !== selectedType)
                    return false

               if (selectedSection && user.section !== selectedSection) return false
               if (selectedCourse && user.course !== selectedCourse) return false

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

 const sortedFiltered = [...filtered].sort((a, b) => {
        const userOrder: Record<string, number> = { OSA: 0, STUDENT: 1 }
        const userOsa = userOrder[a.userType!]
        const userStudent = userOrder[b.userType!]
       
        if (userOsa < userStudent) return -1
         if (userOsa > userStudent) return 1
     
        const nameA = `${a.firstName } ${a.lastName }`.toLowerCase()
        const nameB = `${b.firstName } ${b.lastName }`.toLowerCase()
        
         if (nameA < nameB) return -1
          if (nameA > nameB) return 1
          return 0
    })

          setFilteredUsers(sortedFiltered)
          setCurrentPage(1)
     }, [searchTerm, selectedType, selectedSection, selectedCourse, users])

     const openDialog = (dialog: keyof typeof dialogState) =>
          setDialogState((prev) => ({ ...prev, [dialog]: true }))

     const closeDialog = (dialog: keyof typeof dialogState) =>
          setDialogState((prev) => ({ ...prev, [dialog]: false }))

     const openUserUpdate = (user: UpdateUserDetailsInterface) => {
          setCurrentUser(user)
          setDialogState((prev) => ({ ...prev, updateUser: true, updateStudent: false }))
     }

     const openStudentUpdate = (user: UpdateUserDetailsInterface) => {
          setCurrentUser(user)
          setDialogState((prev) => ({ ...prev, updateStudent: true, updateUser: false }))
     }

     const handleUserUpdated = () => {
          loadUsers()
          setDialogState((prev) => ({ ...prev, updateUser: false, updateStudent: false }))
          setCurrentUser(null)
     }

     const handleDeleteSection = async () => {
          if (!dialogState.confirmDelete) return
          try {
               setDeleting(true)
               const sectionToDelete =
                    dialogState.confirmDelete === "N/A" ? "" : dialogState.confirmDelete
               await deleteStudentAccountBySection(sectionToDelete)
               loadUsers()
               setDialogState((prev) => ({
                    ...prev,
                    deleteResult: {
                         success: true,
                         message: `All users in section "${prev.confirmDelete}" deleted successfully.`,
                    },
                    confirmDelete: null,
                    deleteModal: false,
                    moreSettings: false,
               }))
          } catch (err) {
               setDialogState((prev) => ({
                    ...prev,
                    deleteResult: {
                         success: false,
                         message: `Failed to delete users in section "${prev.confirmDelete}": ${
                              err instanceof Error ? err.message : "Unknown error"
                         }`,
                    },
                    confirmDelete: null,
                    deleteModal: false,
                    moreSettings: false,
               }))
          } finally {
               setDeleting(false)
          }
     }

     return (
          <ProtectedLayout>
               <div className="flex flex-col w-full h-full min-w-0 gap-6">
                    {/* Header */}
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
                                        <DropdownMenuItem onClick={() => openDialog("addOSA")}>
                                             OSA Account
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => openDialog("addStudent")}>
                                             Student Account
                                        </DropdownMenuItem>
                                   </DropdownMenuContent>
                              </DropdownMenu>
                              <Button onClick={() => openDialog("importStudents")}>
                                   Import Student Accounts
                              </Button>
                              <Button variant="outline" onClick={() => openDialog("moreSettings")}>
                                   More Settings <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                         </div>
                    </div>

                    {/* Filters */}
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

                         <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                   <Button variant="outline" size="sm">
                                        {getTypeDisplay(selectedType)}{" "}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                   </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                   <DropdownMenuItem onClick={() => setSelectedType("all")}>
                                        ALL
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => setSelectedType("osa")}>
                                        OSA
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => setSelectedType("student")}>
                                        STUDENT
                                   </DropdownMenuItem>
                              </DropdownMenuContent>
                         </DropdownMenu>
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
                                             onClick={() =>
                                                  setSelectedSection(
                                                       sec === "All Sections" ? null : sec
                                                  )
                                             }
                                        >
                                             {sec}
                                        </DropdownMenuItem>
                                   ))}
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
                                             onClick={() =>
                                                  setSelectedCourse(c === "All Courses" ? null : c)
                                             }
                                        >
                                             {c}
                                        </DropdownMenuItem>
                                   ))}
                              </DropdownMenuContent>
                         </DropdownMenu>

                         <Button variant="outline" size="sm" onClick={loadUsers}>
                              Refresh
                         </Button>
                    </div>

                    <ManagingUsersTable
                         users={paginatedUsers}
                         loading={loading}
                         onUpdateUser={openUserUpdate}
                         onUpdateStudent={openStudentUpdate}
                         currentPage={currentPage}
                         totalPages={totalPages}
                         onPageChange={setCurrentPage}
                    />
               </div>

               <MoreSettingsDialog
                    open={dialogState.moreSettings}
                    onOpenChange={(val) =>
                         setDialogState((prev) => ({ ...prev, moreSettings: val }))
                    }
                    setOpenDeleteModal={() => openDialog("deleteModal")}
               />

               <Dialog
                    open={dialogState.deleteModal}
                    onOpenChange={() => closeDialog("deleteModal")}
               >
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
                                        onClick={() =>
                                             setDialogState((prev) => ({
                                                  ...prev,
                                                  confirmDelete: sec,
                                             }))
                                        }
                                   >
                                        {sec}
                                   </Button>
                              ))}
                         </div>
                         <Button
                              variant="ghost"
                              className="mt-4 w-full"
                              onClick={() => closeDialog("deleteModal")}
                         >
                              Cancel
                         </Button>
                    </DialogContent>
               </Dialog>

               <Dialog
                    open={!!dialogState.confirmDelete}
                    onOpenChange={() =>
                         setDialogState((prev) => ({ ...prev, confirmDelete: null }))
                    }
               >
                    <DialogContent className="max-w-md w-full">
                         <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                         </DialogHeader>
                         <p className="mt-2 text-sm text-gray-600">
                              Are you sure you want to delete all users in section{" "}
                              <span className="font-semibold">{dialogState.confirmDelete}</span>?
                              This action cannot be undone.
                         </p>
                         <div className="flex justify-end gap-2 mt-4">
                              <Button
                                   variant="outline"
                                   onClick={() =>
                                        setDialogState((prev) => ({ ...prev, confirmDelete: null }))
                                   }
                                   disabled={deleting}
                              >
                                   Cancel
                              </Button>
                              <Button
                                   className="bg-red-500 text-white"
                                   onClick={handleDeleteSection}
                                   disabled={deleting}
                              >
                                   {deleting ? "Deleting..." : "Delete"}
                              </Button>
                         </div>
                    </DialogContent>
               </Dialog>

               <Dialog
                    open={!!dialogState.deleteResult}
                    onOpenChange={() =>
                         setDialogState((prev) => ({
                              ...prev,
                              deleteResult: null,
                              confirmDelete: null,
                         }))
                    }
               >
                    <DialogContent className="max-w-sm w-full">
                         <DialogHeader>
                              <DialogTitle>
                                   {dialogState.deleteResult?.success ? "Success" : "Failed"}
                              </DialogTitle>
                         </DialogHeader>

                         <p
                              className={`mt-2 text-sm font-semibold ${
                                   dialogState.deleteResult?.success
                                        ? "text-green-600"
                                        : "text-red-600"
                              }`}
                         >
                              {dialogState.deleteResult?.message}
                         </p>

                         <div className="flex justify-end mt-4">
                              <Button
                                   onClick={() =>
                                        setDialogState((prev) => ({
                                             ...prev,
                                             deleteResult: null,
                                             confirmDelete: null,
                                             deleteModal: false,
                                             moreSettings: false,
                                        }))
                                   }
                              >
                                   OK
                              </Button>
                         </div>
                    </DialogContent>
               </Dialog>

               <ImportStudentsDialog
                    open={dialogState.importStudents}
                    onOpenChange={(val) =>
                         setDialogState((prev) => ({ ...prev, importStudents: val }))
                    }
               />
               <EditUserDetailsDialog
                    open={dialogState.updateUser}
                    onOpenChange={(val) => setDialogState((prev) => ({ ...prev, updateUser: val }))}
                    user={currentUser}
                    onUpdated={handleUserUpdated}
               />
               <EditStudentDetailsDialog
                    open={dialogState.updateStudent}
                    onOpenChange={(val) =>
                         setDialogState((prev) => ({ ...prev, updateStudent: val }))
                    }
                    user={currentUser}
                    onUpdated={handleUserUpdated}
               />
               <CreateOsaAccountDialog
                    open={dialogState.addOSA}
                    onOpenChange={(val) => setDialogState((prev) => ({ ...prev, addOSA: val }))}
                    onAdd={loadUsers}
               />
               <CreateStudentAccountDialog
                    open={dialogState.addStudent}
                    onOpenChange={(val) => setDialogState((prev) => ({ ...prev, addStudent: val }))}
                    onAdd={loadUsers}
               />
          </ProtectedLayout>
     )
}
