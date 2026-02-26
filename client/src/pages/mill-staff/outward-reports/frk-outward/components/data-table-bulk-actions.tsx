import { type Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFrkOutward } from './frk-outward-provider'

interface DataTableBulkActionsProps<TData> {
    table: Table<TData>
}

export function DataTableBulkActions<TData>({
    table,
}: DataTableBulkActionsProps<TData>) {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = useFrkOutward()
    const selectedRows = table.getFilteredSelectedRowModel().rows

    if (selectedRows.length === 0) {
        return null
    }

    return (
        <div className='fixed bottom-4 left-1/2 z-50 -translate-x-1/2'>
            <Button
                variant='secondary'
                size='sm'
                className='h-9 gap-2 shadow-lg'
                onClick={() => setOpen('delete-multi')}
            >
                <Trash className='h-4 w-4' />
                {t('common.delete')} {selectedRows.length} {t('common.selected')}
            </Button>
        </div>
    )
}
