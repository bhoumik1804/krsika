import { AxiosError } from 'axios'
import { toast } from 'sonner'

export const handleServerError = (error: unknown) => {
    // 1. Check if it is an Axios Error with a server response
    if (error instanceof AxiosError) {
        // Since our apiClient interceptor ensures response.data.message exists
        // we can try to access it.
        const serverMessage = error.response?.data?.message

        if (serverMessage) {
            toast.error(serverMessage)
            return
        }
    }

    // 2. Fallback for generic JS Errors (e.g., code syntax errors)
    if (error instanceof Error) {
        toast.error(error.message)
        return
    }

    // 3. Final Fallback for unknown objects
    toast.error('An unexpected error occurred.')
}
