export interface OsaEditMyProfileInterface {
    firstName: string
    lastName: string
    contactNumber: string
    email: string
    accountStatus: "ACTIVE"
    userType: "OSA"
    createdAt?: string | null
    updatedAt?: string | null
}