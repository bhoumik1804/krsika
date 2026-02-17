import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { OutwardBalanceLiftingRiceMultiDeleteDialog } from './outward-balance-lifting-rice-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
    table: Table<TData>
}

export function DataTableBulkActions<TData>({
    table,
}: DataTableBulkActionsProps<TData>) {
    const { t } = useTranslation('mill-staff')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    return (
        <>
            <BulkActionsToolbar
                table={table}
                entityName={t('common.item').toLowerCase()}
            >
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
                                {t('common.delete')}
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>
                            {t(
                                'outwardRiceSales.multiDeleteDialog.description'
                            )}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </BulkActionsToolbar>

            <OutwardBalanceLiftingRiceMultiDeleteDialog
                table={table}
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
            />
        </>
    )
}
