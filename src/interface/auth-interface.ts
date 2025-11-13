/**
 * LoginResponse interface representing a login response payload.
 */
export interface LoginResponse {
     token?: string
     email?: string
     success?: boolean
     message?: string
}

/**
 * LoginRequest interface representing a login request payload.
 */
export interface LoginRequest {
     email?: string
     password?: string
}
