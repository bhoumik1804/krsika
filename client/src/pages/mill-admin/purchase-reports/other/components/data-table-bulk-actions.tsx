import { useState } from 'react'
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
import { type OtherPurchase } from '../data/schema'
import { OtherMultiDeleteDialog } from './other-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
    table: Table<TData>
}

export function DataTableBulkActions<TData>({
    table,
}: DataTableBulkActionsProps<TData>) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleBulkStatusChange = (status: 'completed' | 'cancelled') => {
        const selectedPurchases = selectedRows.map(
            (row) => row.original as OtherPurchase
        )
        toast.promise(sleep(2000), {
            loading: `Marking as ${status}...`,
            success: () => {
                table.resetRowSelection()
                return `Marked ${selectedPurchases.length} purchase${selectedPurchases.length > 1 ? 's' : ''} as ${status}`
            },
            error: `Error updating purchases`,
        })
    }

    return (
        <>
            <BulkActionsToolbar table={table} entityName='purchase'>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handleBulkStatusChange('completed')}
                            className='size-8'
                        >
                            <CheckCircle />
                            <span className='sr-only'>Mark completed</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Mark selected as completed</p>
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
                            <span className='sr-only'>Delete selected</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete selected purchases</p>
                    </TooltipContent>
                </Tooltip>
            </BulkActionsToolbar>

            <OtherMultiDeleteDialog
                table={table}
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
            />
        </>
    )
}
