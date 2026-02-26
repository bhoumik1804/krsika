import { type Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { kodhaOutward } from './kodha-outward-provider'

interface DataTableBulkActionsProps<TData> {
    table: Table<TData>
}

export function DataTableBulkActions<TData>({
    table,
}: DataTableBulkActionsProps<TData>) {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = kodhaOutward()
    const selectedRows = table.getFilteredSelectedRowModel().rows

    if (selectedRows.length === 0) {
        return null
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className='fixed bottom-4 left-1/2 z-50 -translate-x-1/2'>
                    <Button
                        variant='secondary'
                        size='sm'
                        className='h-9 animate-in gap-2 shadow-lg zoom-in-95 slide-in-from-bottom-4'
                    >
                        {selectedRows.length} {t('common.selected')}
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='center' className='w-48'>
                <DropdownMenuItem
                    onClick={() => setOpen('delete-multi')}
                    className='text-red-600 focus:text-red-600'
                >
                    <Trash className='mr-2 h-4 w-4' />
                    {t('common.deleteSelected')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
