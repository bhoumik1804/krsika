import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { CheckCircle, Trash2 } from 'lucide-react'
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
import { type OutwardEntry } from '../data/schema'
import { OutwardsMultiDeleteDialog } from './outwards-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
    table: Table<TData>
}

export function DataTableBulkActions<TData>({
    table,
}: DataTableBulkActionsProps<TData>) {
    const { t } = useTranslation('mill-staff')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleBulkStatusChange = (status: 'dispatched') => {
        const selectedEntries = selectedRows.map(
            (row) => row.original as OutwardEntry
        )
        toast.promise(sleep(2000), {
            loading: `Marking as ${status}...`,
            success: () => {
                table.resetRowSelection()
                return `Marked ${selectedEntries.length} outward entr${selectedEntries.length > 1 ? ' ies' : 'y'} as ${status}`
            },
            error: `Error updating outward entries`,
        })
    }

    return (
        <>
            <BulkActionsToolbar table={table} entityName='outward entry'>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handleBulkStatusChange('dispatched')}
                            className='size-8'
                        >
                            <CheckCircle />
                            <span className='sr-only'>Mark dispatched</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Mark selected as dispatched</p>
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
                            <span className='sr-only'>
                                {t('inputReports.delete.selected')}
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('inputReports.delete.selectedRecords')}</p>
                    </TooltipContent>
                </Tooltip>
            </BulkActionsToolbar>

            <OutwardsMultiDeleteDialog
                table={table}
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
            />
        </>
    )
}
