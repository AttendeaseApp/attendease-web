import { AccountStatus } from "./account/status/AccountStatus"
import { UserType } from "./type/UserType"

export interface Users {
     userId: string
     firstName: string
     lastName: string
     password: string
     contactNumber?: string
     email: string
     accountStatus: keyof AccountStatus
     userType: UserType
     updatedBy?: string
     createdAt: string
     updatedAt?: string
}
