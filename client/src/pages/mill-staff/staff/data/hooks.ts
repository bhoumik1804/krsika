/**
 * Staff Hooks
 * React Query hooks for Staff data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    fetchStaffList,
    fetchStaffById,
    fetchStaffSummary,
    createStaff,
    updateStaff,
    deleteStaff,
    bulkDeleteStaff,
    markAttendance,
    bulkMarkAttendance,
    fetchAttendanceSummary,
    fetchBulkAttendanceSummary,
    exportStaff,
} from './service'
import type {
    StaffResponse,
    StaffListResponse,
    StaffSummaryResponse,
    AttendanceSummaryResponse,
    BulkAttendanceSummaryResponse,
    CreateStaffRequest,
    UpdateStaffRequest,
    MarkAttendanceRequest,
    BulkMarkAttendanceRequest,
    StaffQueryParams,
    AttendanceSummaryQueryParams,
} from './types'

// ==========================================
// Query Keys
// ==========================================

export const staffKeys = {
    all: ['staff'] as const,
    lists: () => [...staffKeys.all, 'list'] as const,
    list: (millId: string, params?: StaffQueryParams) =>
        [...staffKeys.lists(), millId, params] as const,
    details: () => [...staffKeys.all, 'detail'] as const,
    detail: (millId: string, id: string) =>
        [...staffKeys.details(), millId, id] as const,
    summaries: () => [...staffKeys.all, 'summary'] as const,
    summary: (millId: string) => [...staffKeys.summaries(), millId] as const,
    attendance: () => [...staffKeys.all, 'attendance'] as const,
    attendanceSummary: (
        millId: string,
        staffId: string,
        params: AttendanceSummaryQueryParams
    ) =>
        [
            ...staffKeys.attendance(),
            'summary',
            millId,
            staffId,
            params,
        ] as const,
    bulkAttendanceSummary: (
        millId: string,
        params: AttendanceSummaryQueryParams
    ) => [...staffKeys.attendance(), 'bulk-summary', millId, params] as const,
}

// ==========================================
// Query Hooks
// ==========================================

/**
 * Hook to fetch staff list with pagination and filters
 */
export const useStaffList = (
    millId: string,
    params?: StaffQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<StaffListResponse, Error>({
        queryKey: staffKeys.list(millId, params),
        queryFn: () => fetchStaffList(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single staff member
 */
export const useStaffDetail = (
    millId: string,
    id: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<StaffResponse, Error>({
        queryKey: staffKeys.detail(millId, id),
        queryFn: () => fetchStaffById(millId, id),
        enabled: options?.enabled ?? (!!millId && !!id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch staff summary/statistics
 */
export const useStaffSummary = (
    millId: string,
    options?: { enabled?: boolean }
) => {
    return useQuery<StaffSummaryResponse, Error>({
        queryKey: staffKeys.summary(millId),
        queryFn: () => fetchStaffSummary(millId),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch attendance summary for a single staff member
 */
export const useAttendanceSummary = (
    millId: string,
    staffId: string,
    params: AttendanceSummaryQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<AttendanceSummaryResponse, Error>({
        queryKey: staffKeys.attendanceSummary(millId, staffId, params),
        queryFn: () => fetchAttendanceSummary(millId, staffId, params),
        enabled: options?.enabled ?? (!!millId && !!staffId),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch bulk attendance summary for all staff
 */
export const useBulkAttendanceSummary = (
    millId: string,
    params: AttendanceSummaryQueryParams,
    options?: { enabled?: boolean }
) => {
    return useQuery<BulkAttendanceSummaryResponse, Error>({
        queryKey: staffKeys.bulkAttendanceSummary(millId, params),
        queryFn: () => fetchBulkAttendanceSummary(millId, params),
        enabled: options?.enabled ?? !!millId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Hook to create a new staff member
 */
export const useCreateStaff = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<StaffResponse, Error, CreateStaffRequest>({
        mutationFn: (data) => createStaff(millId, data),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: staffKeys.lists(),
            })
            // Invalidate summary as well
            queryClient.invalidateQueries({
                queryKey: staffKeys.summaries(),
            })
            toast.success('Staff member created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create staff member')
        },
    })
}

/**
 * Hook to update an existing staff member
 */
export const useUpdateStaff = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<StaffResponse, Error, UpdateStaffRequest>({
        mutationFn: (data) => updateStaff(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: staffKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(staffKeys.detail(millId, data._id), data)
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: staffKeys.summaries(),
            })
            toast.success('Staff member updated successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update staff member')
        },
    })
}

/**
 * Hook to delete a staff member
 */
export const useDeleteStaff = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: (id) => deleteStaff(millId, id),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: staffKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: staffKeys.summaries(),
            })
            toast.success('Staff member deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete staff member')
        },
    })
}

/**
 * Hook to bulk delete staff members
 */
export const useBulkDeleteStaff = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string[]>({
        mutationFn: (ids) => bulkDeleteStaff(millId, ids),
        onSuccess: (_, ids) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: staffKeys.lists(),
            })
            // Invalidate summary
            queryClient.invalidateQueries({
                queryKey: staffKeys.summaries(),
            })
            toast.success(`${ids.length} staff members deleted successfully`)
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete staff members')
        },
    })
}

/**
 * Hook to mark attendance for a single staff member
 */
export const useMarkAttendance = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<StaffResponse, Error, MarkAttendanceRequest>({
        mutationFn: (data) => markAttendance(millId, data),
        onSuccess: (data) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: staffKeys.lists(),
            })
            // Update the specific detail cache
            queryClient.setQueryData(staffKeys.detail(millId, data._id), data)
            // Invalidate attendance summaries
            queryClient.invalidateQueries({
                queryKey: staffKeys.attendance(),
            })
            toast.success('Attendance marked successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to mark attendance')
        },
    })
}

/**
 * Hook to bulk mark attendance for multiple staff members
 */
export const useBulkMarkAttendance = (millId: string) => {
    const queryClient = useQueryClient()

    return useMutation<
        { success: number; failed: number },
        Error,
        BulkMarkAttendanceRequest
    >({
        mutationFn: (data) => bulkMarkAttendance(millId, data),
        onSuccess: (result) => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({
                queryKey: staffKeys.lists(),
            })
            // Invalidate attendance summaries
            queryClient.invalidateQueries({
                queryKey: staffKeys.attendance(),
            })
            toast.success(
                `Attendance marked for ${result.success} staff members${result.failed > 0 ? `, ${result.failed} failed` : ''}`
            )
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to mark bulk attendance')
        },
    })
}

/**
 * Hook to export staff list
 */
export const useExportStaff = (millId: string) => {
    return useMutation<
        Blob,
        Error,
        { params?: StaffQueryParams; format?: 'csv' | 'xlsx' }
    >({
        mutationFn: ({ params, format }) => exportStaff(millId, params, format),
        onSuccess: (blob, { format = 'csv' }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `staff-${new Date().toISOString().split('T')[0]}.${format}`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
            toast.success('Export completed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to export data')
        },
    })
}
