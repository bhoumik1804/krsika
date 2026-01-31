import { useLogout } from '@/pages/landing/hooks/use-auth'
import { useNavigate, useLocation } from 'react-router'
import { useAuthStore } from '@/stores/auth-store'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const { logoutAsync, isLoading } = useLogout()
    const { logout } = useAuthStore()

    const handleSignOut = async () => {
        try {
            await logoutAsync()
            logout()
            const currentPath = location.pathname
            navigate(`/sign-in?redirect=${encodeURIComponent(currentPath)}`, {
                replace: true,
            })
        } catch (error) {
            // Error already handled by useLogout onError callback
            const currentPath = location.pathname
            navigate(`/sign-in?redirect=${encodeURIComponent(currentPath)}`, {
                replace: true,
            })
        }
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title='Sign out'
            desc='Are you sure you want to sign out? You will need to sign in again to access your account.'
            confirmText='Sign out'
            destructive
            disabled={isLoading}
            handleConfirm={handleSignOut}
            className='sm:max-w-sm'
        />
    )
}
