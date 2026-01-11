interface ErrorResponse {
     message?: string
     error?: string
     errors?: Array<{ defaultMessage?: string }>
}

/**
 * Extracts and formats error message from response
 */
export const handleApiError = async (res: Response, defaultMessage: string): Promise<never> => {
     let errorMessage = defaultMessage

     try {
          const contentType = res.headers.get("content-type")

          if (contentType?.includes("application/json")) {
               const errorBody: ErrorResponse = await res.json()
               errorMessage =
                    errorBody.message ||
                    errorBody.error ||
                    (Array.isArray(errorBody.errors) && errorBody.errors[0]?.defaultMessage) ||
                    defaultMessage
          } else {
               const textError = await res.text()
               if (textError && textError.trim()) {
                    errorMessage = textError
               }
          }
     } catch (parseError) {
          console.error("Failed to parse error response:", parseError)
          errorMessage = res.statusText || defaultMessage
     }

     throw new Error(errorMessage)
}
