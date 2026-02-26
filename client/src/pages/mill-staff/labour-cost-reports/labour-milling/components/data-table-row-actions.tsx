import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'
import { type Row } from '@tanstack/react-table'
import { Trash2, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type LabourMilling } from '../data/schema'
import { labourMilling } from './labour-milling-provider'

type DataTableRowActionsProps = {
    row: Row<LabourMilling>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { t } = useTranslation('mill-staff')
    const { setOpen, setCurrentRow } = labourMilling()
    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
                    >
                        <DotsHorizontalIcon className='h-4 w-4' />
                        <span className='sr-only'>{t('common.openMenu')}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-[160px]'>
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(row.original)
                            setOpen('edit')
                        }}
                    >
                        {t('common.edit')}
                        <DropdownMenuShortcut>
                            <Wrench size={16} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(row.original)
                            setOpen('delete')
                        }}
                        className='text-red-500!'
                    >
                        {t('common.delete')}
                        <DropdownMenuShortcut>
                            <Trash2 size={16} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
