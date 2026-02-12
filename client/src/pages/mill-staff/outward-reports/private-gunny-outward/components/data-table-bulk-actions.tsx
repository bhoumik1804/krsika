import { useState } from 'react'
import { Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { PrivateGunnyOutward } from '../data/schema'
import { PrivateGunnyOutwardMultiDeleteDialog } from './private-gunny-outward-multi-delete-dialog'

interface DataTableBulkActionsProps {
    table: Table<PrivateGunnyOutward>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    if (table.getFilteredSelectedRowModel().rows.length === 0) return null

    return (
        <>
            <div className='flex gap-2'>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='outline'
                            size='sm'
                            className='ml-auto hidden h-8 lg:flex'
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <Trash2 className='mr-2 h-4 w-4' />
                            Delete (
                            {table.getFilteredSelectedRowModel().rows.length})
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete selected records</TooltipContent>
                </Tooltip>
            </div>

            <PrivateGunnyOutwardMultiDeleteDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                table={table}
            />
        </>
    )
}
