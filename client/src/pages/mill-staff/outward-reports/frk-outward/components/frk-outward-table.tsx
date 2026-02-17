import { useEffect, useState } from 'react'
import {
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { type FrkOutward } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { useFrkOutwardColumns } from './frk-outward-columns'
import { FrkOutwardMultiDeleteDialog } from './frk-outward-multi-delete-dialog'
import { useFrkOutward } from './frk-outward-provider'

interface DataTableProps {
    data: FrkOutward[]
    search: Record<string, unknown>
    navigate: NavigateFn
    serverPagination?: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasPrevPage: boolean
        hasNextPage: boolean
        prevPage: number | null
        nextPage: number | null
    }
}

export function FrkOutwardTable({
    data,
    search,
    navigate,
    serverPagination,
}: DataTableProps) {
    const { t } = useTranslation('mill-staff')
    const { open, setOpen } = useFrkOutward()
    const columns = useFrkOutwardColumns()
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    )

    const {
        columnFilters,
        onColumnFiltersChange,
        pagination,
        onPaginationChange,
        ensurePageInRange,
    } = useTableUrlState({
        search,
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
        globalFilter: { enabled: false },
        columnFilters: [
            {
                columnId: 'partyName',
                searchKey: 'partyName',
                type: 'string',
            },
        ],
    })

    const table = useReactTable({
        data,
        columns,
        state: {
            pagination,
            rowSelection,
            columnFilters,
            columnVisibility,
        },
        pageCount: serverPagination?.totalPages ?? -1,
        manualPagination: !!serverPagination,
        enableRowSelection: true,
        onPaginationChange,
        onColumnFiltersChange,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: serverPagination
            ? undefined
            : getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    // Ensure page is within range when pagination changes
    useEffect(() => {
        if (serverPagination) {
            ensurePageInRange(serverPagination.totalPages)
        }
    }, [serverPagination, ensurePageInRange])

    return (
        <div className='space-y-4'>
            <DataTableToolbar
                table={table}
                searchPlaceholder='Search party name...'
                searchKey='partyName'
            />
            <DataTableBulkActions table={table} />
            <div className='overflow-hidden rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className={
                                                header.column.columnDef.meta
                                                    ?.className ?? ''
                                            }
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={
                                                cell.column.columnDef.meta
                                                    ?.className ?? ''
                                            }
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center'
                                >
                                    {t('common.noResults')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
            <FrkOutwardMultiDeleteDialog
                table={table}
                open={open === 'delete-multi'}
                onOpenChange={(isOpen) =>
                    setOpen(isOpen ? 'delete-multi' : null)
                }
            />
        </div>
    )
}
