import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { CheckCircle, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type InwardEntry } from '../data/schema'
import { InwardsMultiDeleteDialog } from './inwards-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
    table: Table<TData>
}

export function DataTableBulkActions<TData>({
    table,
}: DataTableBulkActionsProps<TData>) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleBulkStatusChange = (status: 'verified') => {
        const selectedEntries = selectedRows.map(
            (row) => row.original as InwardEntry
        )
        toast.promise(sleep(2000), {
            loading: `Marking as ${status}...`,
            success: () => {
                table.resetRowSelection()
                return `Marked ${selectedEntries.length} entr${selectedEntries.length > 1 ? ' ies' : 'y'} as ${status}`
            },
            error: `Error updating entries`,
        })
    }

    return (
        <>
            <BulkActionsToolbar table={table} entityName='entry'>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handleBulkStatusChange('verified')}
                            className='size-8'
                        >
                            <CheckCircle />
                            <span className='sr-only'>Mark verified</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Mark selected as verified</p>
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
                        <p>Delete selected entries</p>
                    </TooltipContent>
                </Tooltip>
            </BulkActionsToolbar>

            <InwardsMultiDeleteDialog
                table={table}
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
            />
        </>
    )
}
