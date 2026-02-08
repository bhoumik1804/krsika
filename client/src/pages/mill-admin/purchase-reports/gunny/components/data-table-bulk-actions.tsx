import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type GunnyPurchaseData } from '../data/schema'
import { GunnyMultiDeleteDialog } from './gunny-multi-delete-dialog'

type DataTableBulkActionsProps = {
    table: Table<GunnyPurchaseData>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    return (
        <>
            <BulkActionsToolbar table={table} entityName='purchase'>
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

            <GunnyMultiDeleteDialog
                table={table}
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
            />
        </>
    )
}
