/**
 * Users Hooks
 * React Query hooks for Users data management (Super Admin)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchUsersList,
    fetchUserById,
    fetchUsersSummary,
    createUser,
    updateUser,
    inviteUser,
    suspendUser,
    reactivateUser,
    deleteUser,
    bulkDeleteUsers,
    exportUsers,
} from './service'
import type {
    UserResponse,
    UserListResponse,
    UserSummaryResponse,
    CreateUserRequest,
    UpdateUserRequest,
    InviteUserRequest,
    UserQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const usersKeys = {
    all: ['users'] as const,
    lists: () => [...usersKeys.all, 'list'] as const,
    list: (params?: UserQueryParams) => [...usersKeys.lists(), params] as const,
    details: () => [...usersKeys.all, 'detail'] as const,
    detail: (id: string) => [...usersKeys.details(), id] as const,
    summaries: () => [...usersKeys.all, 'summary'] as const,
    summary: () => [...usersKeys.summaries()] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch users list with pagination and filters
 */
export const useUsersList = (
    params?: UserQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<UserListResponse, Error>({
        queryKey: usersKeys.list(params),
        queryFn: () => fetchUsersList(params),
        enabled: options?.enabled ?? true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single user
 */
export const useUserDetail = (id: string, options?: { enabled?: boolean }) => {
    return useQuery<UserResponse, Error>({
        queryKey: usersKeys.detail(id),
        queryFn: () => fetchUserById(id),
        enabled: options?.enabled ?? !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch users summary/statistics
 */
export const useUsersSummary = (options?: { enabled?: boolean }) => {
    return useQuery<UserSummaryResponse, Error>({
        queryKey: usersKeys.summary(),
        queryFn: () => fetchUsersSummary(),
        enabled: options?.enabled ?? true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new user
 */
export const useCreateUser = () => {
    const queryClient = useQueryClient()

    return useMutation<UserResponse, Error, CreateUserRequest>({
        mutationFn: (data) => createUser(data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: usersKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: usersKeys.summaries(),
            })
            toast.success('User created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create user')
        },
    })
}

/**
 * Hook to update an existing user
 */
export const useUpdateUser = () => {
    const queryClient = useQueryClient()

    return useMutation<UserResponse, Error, UpdateUserRequest>({
        mutationFn: (data) => updateUser(data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: usersKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(usersKeys.detail(data._id), data)
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: usersKeys.summaries(),
            })
            toast.success('User updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update user')
        },
    })
}

/**
 * Hook to invite a user
 */
export const useInviteUser = () => {
    const queryClient = useQueryClient()

    return useMutation<UserResponse, Error, InviteUserRequest>({
        mutationFn: (data) => inviteUser(data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: usersKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: usersKeys.summaries(),
            })
            toast.success('Invitation sent successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to send invitation')
        },
    })
}

/**
 * Hook to suspend a user
 */
export const useSuspendUser = () => {
    const queryClient = useQueryClient()

    return useMutation<UserResponse, Error, string>({
        mutationFn: (id) => suspendUser(id),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: usersKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(usersKeys.detail(data._id), data)
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: usersKeys.summaries(),
            })
            toast.success('User suspended successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to suspend user')
        },
    })
}

/**
 * Hook to reactivate a suspended user
 */
export const useReactivateUser = () => {
    const queryClient = useQueryClient()

    return useMutation<UserResponse, Error, string>({
        mutationFn: (id) => reactivateUser(id),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: usersKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(usersKeys.detail(data._id), data)
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: usersKeys.summaries(),
            })
            toast.success('User reactivated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to reactivate user')
        },
    })
}

/**
 * Hook to delete a user
 */
export const useDeleteUser = () => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteUser(id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: usersKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: usersKeys.summaries(),
            })
            toast.success('User deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete user')
        },
    })
}

/**
 * Hook to bulk delete users
 */
export const useBulkDeleteUsers = () => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteUsers(ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: usersKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: usersKeys.summaries(),
            })
            toast.success(`${ids.length} users deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete users')
        },
    })
}

/**
 * Hook to export users
 */
export const useExportUsers = () => {
    return useMutation<
        Blob,
        Error,
        { params?: UserQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) => exportUsers(params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `users-export.${format}`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast.success('Users exported successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export users')
        },
    })
}
