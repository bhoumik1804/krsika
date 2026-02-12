import { DotsHorizontalIcon } from '@radix-ui/react-icons'
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
import { type PaddyPurchaseData } from '../data/schema'
import { usePaddy } from './paddy-provider'
import { usePermission } from '@/hooks/use-permission'

type DataTableRowActionsProps = {
    row: Row<PaddyPurchaseData>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { setOpen, setCurrentRow } = usePaddy()
    const { can } = usePermission()

    const canEdit = can('paddy-purchase-report', 'edit')
    const canDelete = can('paddy-purchase-report', 'delete')

    if (!canEdit && !canDelete) {
        return null
    }

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
                    >
                        <DotsHorizontalIcon className='h-4 w-4' />
                        <span className='sr-only'>Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-[160px]'>
                    {canEdit && (
                        <DropdownMenuItem
                            onClick={() => {
                                setCurrentRow(row.original)
                                setOpen('edit')
                            }}
                        >
                            Edit
                            <DropdownMenuShortcut>
                                <Wrench size={16} />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    )}
                    {canEdit && canDelete && <DropdownMenuSeparator />}
                    {canDelete && (
                        <DropdownMenuItem
                            onClick={() => {
                                setCurrentRow(row.original)
                                setOpen('delete')
                            }}
                            className='text-red-500!'
                        >
                            Delete
                            <DropdownMenuShortcut>
                                <Trash2 size={16} />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
