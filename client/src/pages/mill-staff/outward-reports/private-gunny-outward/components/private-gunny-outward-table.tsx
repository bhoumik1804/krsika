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
import { type PrivateGunnyOutward } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { PrivateGunnyOutwardColumns } from './private-gunny-outward-columns'

interface DataTableProps {
    data: PrivateGunnyOutward[]
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

export function PrivateGunnyOutwardTable({
    data,
    search,
    navigate,
    serverPagination,
}: DataTableProps) {
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
        columns: PrivateGunnyOutwardColumns(),
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
                                    colSpan={table.getAllColumns().length}
                                    className='h-24 text-center'
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    )
}
