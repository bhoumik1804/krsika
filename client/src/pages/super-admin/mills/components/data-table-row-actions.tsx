'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { MILL_STATUS } from '@/constants'
import { CheckCircle, Trash2, XCircle, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useVerifyMill } from '../data/hooks'
import { type Mill } from '../data/schema'
import { useMills } from './mills-provider'

type DataTableRowActionsProps = {
    row: Row<Mill>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { setOpen, setCurrentRow } = useMills()
    const verifyMill = useVerifyMill()

    const status = (row.original as any).status
    const isPending =
        status === MILL_STATUS.PENDING_VERIFICATION ||
        status === 'pending-verification'

    const handleApprove = () => {
        const millData: any = {
            id: (row.original as any).id,
            status: 'active',
        }
        verifyMill.mutate(millData)
    }

    const handleRejectClick = () => {
        setCurrentRow(row.original as any)
        setOpen('reject')
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
                    {isPending && (
                        <>
                            <DropdownMenuItem onClick={handleApprove}>
                                Approve
                                <DropdownMenuShortcut>
                                    <CheckCircle
                                        size={16}
                                        className='text-green-500'
                                    />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleRejectClick}>
                                Reject
                                <DropdownMenuShortcut>
                                    <XCircle
                                        size={16}
                                        className='text-red-500'
                                    />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}

                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(row.original as any)
                            setOpen('edit')
                        }}
                    >
                        Edit
                        <DropdownMenuShortcut>
                            <Wrench size={16} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(row.original as any)
                            setOpen('delete')
                        }}
                        className='text-red-500!'
                    >
                        Delete
                        <DropdownMenuShortcut>
                            <Trash2 size={16} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
