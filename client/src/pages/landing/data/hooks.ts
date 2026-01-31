import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { registerMill } from './service'

export const useRegisterMill = () => {
    return useMutation({
        mutationFn: registerMill,
        onSuccess: (data) => {
            toast.success(data.message || 'Registration successful')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Registration failed')
        },
    })
}
