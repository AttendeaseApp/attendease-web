export interface UserStudentResponse {
  userId: number
  firstName: string
  lastName: string
  email?: string
  contactNumber?: string
  accountStatus?: string
  userType?: string
  createdAt?: string
  updatedAt?: string
  // additional info if user is a student:
  studentId: number
  studentNumber: string
  section?: string
  course?: string
}
