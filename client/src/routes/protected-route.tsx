/**
 * Protected Route Component
 * Restricts access based on user role
 * Redirects to 403 page if user doesn't have required role
 */
import { ReactNode } from 'react'
import { useUser } from '@/pages/landing/hooks/use-auth'
import type { UserRole } from '@/types'
import { Navigate } from 'react-router'
import { useAuthStore } from '@/stores/auth-store'
import { LoadingSpinner } from '@/components/loading-spinner'

interface ProtectedRouteProps {
    children: ReactNode
    requiredRoles?: UserRole[]
    fallbackPath?: string
}

/**
 * ProtectedRoute Component
 * @param children - The component to render if authorized
 * @param requiredRoles - Array of roles allowed to access this route
 * @param fallbackPath - Path to redirect to if unauthorized (default: /403)
 */
export function ProtectedRoute({
    children,
    requiredRoles = [],
    fallbackPath = '/403',
}: ProtectedRouteProps) {
    const user = useAuthStore((state) => state.user)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const { isLoading } = useUser()

    // Show loading while checking authentication
    if (isLoading) {
        return <LoadingSpinner className='h-screen w-screen' />
    }

    // Not authenticated
    if (!user || !isAuthenticated) {
        return <Navigate to='/sign-in' replace />
    }

    // If no specific roles required, allow access
    if (requiredRoles.length === 0) {
        return children
    }

    // Check if user has one of the required roles
    if (!requiredRoles.includes(user.role)) {
        return <Navigate to={fallbackPath} replace />
    }

    return children
}
