import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import type { BalanceLiftingPurchasesGunny } from '../data/schema'
import { GunnyMultiDeleteDialog } from './balance-lifting-purchases-gunny-multi-delete-dialog'

type DataTableBulkActionsProps = {
    table: Table<BalanceLiftingPurchasesGunny>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
    const { t } = useTranslation('mill-staff')
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
                            <span className='sr-only'>{t('common.deleteSelected')}</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('common.deleteSelectedRecords')}</p>
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
