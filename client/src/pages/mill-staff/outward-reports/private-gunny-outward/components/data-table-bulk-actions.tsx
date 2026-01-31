import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { PrivateGunnyOutward } from '../data/schema'
import { usePrivateGunnyOutwardContext } from './private-gunny-outward-provider'

interface DataTableBulkActionsProps {
    table: Table<PrivateGunnyOutward>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
    const { setOpen } = usePrivateGunnyOutwardContext()

    if (table.getFilteredSelectedRowModel().rows.length == 0) return null

    return (
        <div className='flex gap-2'>
            <Button
                variant='outline'
                size='sm'
                className='ml-auto hidden h-8 lg:flex'
                onClick={() => setOpen('delete-multi')}
            >
                Delete ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
        </div>
    )
}
