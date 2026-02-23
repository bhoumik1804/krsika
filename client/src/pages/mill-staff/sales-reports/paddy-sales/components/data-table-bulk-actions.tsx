import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type Table } from '@tanstack/react-table'
import { Trash2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type PaddySales } from '../data/schema'
import { PaddySalesMultiDeleteDialog } from './paddy-sales-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
    table: Table<TData>
}

export function DataTableBulkActions<TData>({
    table,
}: DataTableBulkActionsProps<TData>) {
    const { t } = useTranslation('mill-staff')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleBulkStatusChange = (status: 'completed' | 'cancelled') => {
        const selectedRecords = selectedRows.map(
            (row) => row.original as PaddySales
        )
        toast.promise(sleep(2000), {
            loading: t('common.markingAs', {
                status: status === 'completed' ? t('common.completed') : t('common.cancelled')
            }),
            success: () => {
                table.resetRowSelection()
                return t('common.markedAs', {
                    count: selectedRecords.length,
                    item: selectedRecords.length > 1 ? t('common.records') : t('common.record'),
                    status: status === 'completed' ? t('common.completed') : t('common.cancelled')
                })
            },
            error: t('common.errorUpdating'),
        })
    }

    return (
        <>
            <BulkActionsToolbar table={table} entityName='record'>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handleBulkStatusChange('completed')}
                            className='size-8'
                        >
                            <CheckCircle />
                            <span className='sr-only'>{t('common.markCompleted')}</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('common.markSelectedAsCompleted')}</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='destructive'
                            size='icon'
                            onClick={() => setShowDeleteConfirm(true)}
                            className='size-8'
                        >
                            <Trash2 />
                            <span className='sr-only'>{t('common.deleteSelected')}</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('common.deleteSelectedRecords')}</p>
                    </TooltipContent>
                </Tooltip>
            </BulkActionsToolbar>

            <PaddySalesMultiDeleteDialog
                table={table}
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
            />
        </>
    )
}
