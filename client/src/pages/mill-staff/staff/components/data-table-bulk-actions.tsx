import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, UserX, UserCheck } from 'lucide-react'
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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const handleBulkStatusChange = (status: 'active' | 'inactive') => {
        const selectedStaff = selectedRows.map((row) => row.original as Staff)
        toast.promise(sleep(2000), {
            loading: `${status === 'active' ? 'Activating' : 'Deactivating'} staff...`,
            success: () => {
                table.resetRowSelection()
                return `${status === 'active' ? 'Activated' : 'Deactivated'} ${selectedStaff.length} staff member${selectedStaff.length > 1 ? 's' : ''}`
            },
            error: `Error ${status === 'active' ? 'activating' : 'deactivating'} staff`,
        })
        table.resetRowSelection()
    }

    return (
        <>
            <BulkActionsToolbar table={table} entityName='staff member'>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handleBulkStatusChange('active')}
                            className='size-8'
                            aria-label='Activate selected staff'
                            title='Activate selected staff'
                        >
                            <UserCheck />
                            <span className='sr-only'>
                                Activate selected staff
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Activate selected staff</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handleBulkStatusChange('inactive')}
                            className='size-8'
                            aria-label='Deactivate selected staff'
                            title='Deactivate selected staff'
                        >
                            <UserX />
                            <span className='sr-only'>
                                Deactivate selected staff
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Deactivate selected staff</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='destructive'
                            size='icon'
                            onClick={() => setShowDeleteConfirm(true)}
                            className='size-8'
                            aria-label='Delete selected staff'
                            title='Delete selected staff'
                        >
                            <Trash2 />
                            <span className='sr-only'>
                                Delete selected staff
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete selected staff</p>
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
