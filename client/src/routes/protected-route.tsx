/**
 * Protected Route Component
 * Restricts access based on user role
 * Redirects to 403 page if user doesn't have required role
 */
import { ReactNode } from 'react'
import type { UserRole } from '@/constants'
import { Navigate } from 'react-router'
import { usePermission } from '@/hooks/use-permission'
import { LoadingSpinner } from '@/components/loading-spinner'

interface ProtectedRouteProps {
    children: ReactNode
    requiredRoles?: UserRole[]
    moduleSlug?: string
    action?: string
    fallbackPath?: string
}

/**
 * ProtectedRoute Component
 * @param children - The component to render if authorized
 * @param requiredRoles - Array of roles allowed to access this route
 * @param moduleSlug - The granular module identifier for permission check
 * @param action - The action required (default: 'view')
 * @param fallbackPath - Path to redirect to if unauthorized (default: /403)
 */
export function ProtectedRoute({
    children,
    requiredRoles = [],
    moduleSlug,
    action = 'view',
    fallbackPath = '/403',
}: ProtectedRouteProps) {
    const { isLoading, user, isError, can } = usePermission()

    // Show loading while checking authentication
    if (isLoading) {
        return <LoadingSpinner className='h-screen w-screen' />
    }

    // Not authenticated
    if (!user || isError) {
        return <Navigate to='/sign-in' replace />
    }

    // If roles are specified, check if user has one of them
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        return <Navigate to={fallbackPath} replace />
    }

    // If moduleSlug is specified, check if user has permission
    // Note: super-admin and mill-admin will pass this automatically in the hook
    if (moduleSlug && !can(moduleSlug, action)) {
        return <Navigate to={fallbackPath} replace />
    }

    return children
}
