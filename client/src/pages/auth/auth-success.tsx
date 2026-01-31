import { useEffect, useState } from 'react'
import { useUser } from '@/pages/landing/hooks'
import { USER_ROLES, UserRole } from '@/types'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { LoadingSpinner } from '@/components/loading-spinner'

// -----------------------------
// Type-safe redirect map
// -----------------------------
const ROLE_REDIRECT_MAP: Record<UserRole, string> = {
    [USER_ROLES.SUPER_ADMIN]: '/admin',
    [USER_ROLES.ADMIN]: '/mill-admin/dashboard',
    [USER_ROLES.STAFF]: '/mill-staff/dashboard',
    [USER_ROLES.GUEST_USER]: '/',
}

function getRedirectPath(role: UserRole): string {
    return ROLE_REDIRECT_MAP[role] ?? '/'
}

// -----------------------------
// Optional type guard for safety
// -----------------------------
function isUserRole(role: string): role is UserRole {
    return Object.values(USER_ROLES).includes(role as UserRole)
}

// -----------------------------
// AuthSuccess Component
// -----------------------------
export function AuthSuccess() {
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const { user, isLoading, isError, error: queryError } = useUser()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    useEffect(() => {
        if (user && isAuthenticated) {
            const redirectPath = isUserRole(user.role)
                ? getRedirectPath(user.role)
                : '/'

            setTimeout(() => {
                navigate(redirectPath, { replace: true })
            }, 1000)
        }

        if (isError) {
            setError(queryError?.message || 'Authentication failed.')
            navigate('/sign-in', { replace: true })
        }
    }, [user, isAuthenticated, isError, queryError, navigate])

    return (
        <div className='flex min-h-screen items-center justify-center bg-background'>
            <div className='text-center'>
                {isLoading && (
                    <>
                        <LoadingSpinner className='mx-auto mb-4 h-12 w-12' />
                        <h2 className='text-xl font-semibold'>
                            Completing sign in...
                        </h2>
                        <p className='mt-2 text-muted-foreground'>
                            Please wait while we set up your account
                        </p>
                    </>
                )}

                {error && (
                    <div className='rounded-lg border border-destructive bg-destructive/10 p-6'>
                        <h2 className='text-xl font-semibold text-destructive'>
                            Authentication Failed
                        </h2>
                        <p className='mt-2 text-sm text-muted-foreground'>
                            {error}
                        </p>
                        <p className='mt-4 text-sm text-muted-foreground'>
                            Redirecting to sign in...
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
