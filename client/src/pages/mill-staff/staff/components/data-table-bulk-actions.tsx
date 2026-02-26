import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, UserX, UserCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type Staff } from '../data/schema'
import { StaffMultiDeleteDialog } from './staff-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
    table: Table<TData>
}

export function DataTableBulkActions<TData>({
    table,
}: DataTableBulkActionsProps<TData>) {
    const { t } = useTranslation('mill-staff')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleBulkStatusChange = (status: 'active' | 'inactive') => {
        const selectedStaff = selectedRows.map((row) => row.original as Staff)
        toast.promise(sleep(2000), {
            loading: t(
                `staff.bulkStatusChange.${status === 'active' ? 'activating' : 'deactivating'}`
            ),
            success: () => {
                table.resetRowSelection()
                return t(
                    `staff.bulkStatusChange.${status === 'active' ? 'activated' : 'deactivated'}Success`,
                    {
                        count: selectedStaff.length,
                        member: selectedStaff.length > 1 ? 'members' : 'member',
                    }
                )
            },
            error: t(
                `staff.bulkStatusChange.${status === 'active' ? 'activation' : 'deactivation'}Error`
            ),
        })
        table.resetRowSelection()
    }

    return (
        <>
            <BulkActionsToolbar
                table={table}
                entityName={t('staff.staffMember')}
            >
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handleBulkStatusChange('active')}
                            className='size-8'
                            aria-label={t('staff.activateSelected')}
                            title={t('staff.activateSelected')}
                        >
                            <UserCheck />
                            <span className='sr-only'>
                                {t('staff.activateSelected')}
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('staff.activateSelected')}</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handleBulkStatusChange('inactive')}
                            className='size-8'
                            aria-label={t('staff.deactivateSelected')}
                            title={t('staff.deactivateSelected')}
                        >
                            <UserX />
                            <span className='sr-only'>
                                {t('staff.deactivateSelected')}
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('staff.deactivateSelected')}</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='destructive'
                            size='icon'
                            onClick={() => setShowDeleteConfirm(true)}
                            className='size-8'
                            aria-label={t('staff.deleteSelected')}
                            title={t('staff.deleteSelected')}
                        >
                            <Trash2 />
                            <span className='sr-only'>
                                {t('staff.deleteSelected')}
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('staff.deleteSelected')}</p>
                    </TooltipContent>
                </Tooltip>
            </BulkActionsToolbar>

            <StaffMultiDeleteDialog
                table={table}
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
            />
        </>
    )
}
