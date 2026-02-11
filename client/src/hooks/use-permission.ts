import { useAuthStore } from '@/stores/auth-store'
import { UserRole } from '@/constants'
import { useUser } from '@/pages/landing/hooks/use-auth'

/**
 * Hook to check if current user has required permissions
 */
export function usePermission() {
    const storeUser = useAuthStore((state) => state.user)
    const { isLoading, isError, user: queryUser } = useUser()

    const user = queryUser ?? storeUser

    /**
     * Check if user has access to a module and action
     * @param moduleSlug - The granular module identifier
     * @param action - The action required (view, create, edit, delete)
     */
    const can = (moduleSlug: string | undefined, action: string = 'view') => {
        if (!user) return false

        // super-admin and mill-admin have all permissions
        if (user.role === 'super-admin' || user.role === 'mill-admin') {
            return true
        }

        // If no module slug is provided, we assume it's public or role-based only
        if (!moduleSlug) return true

        const permission = user.permissions?.find(
            (p) => p.moduleSlug === moduleSlug
        )

        if (!permission) return false

        return permission.actions.includes(action)
    }

    /**
     * Check if user has one of the required roles
     */
    const hasRole = (roles: UserRole[]) => {
        if (!user) return false
        return roles.includes(user.role)
    }

    return {
        user,
        isLoading,
        isError,
        can,
        hasRole,
        role: user?.role,
        isAdmin: user?.role === 'mill-admin' || user?.role === 'super-admin',
    }
}
