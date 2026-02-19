import { useEffect, useState } from 'react'
import {
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { type PaddyPurchaseData } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { usePaddyColumns } from './paddy-columns'

type DataTableProps = {
    data: PaddyPurchaseData[]
    search: Record<string, unknown>
    navigate: NavigateFn
    pagination?: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export function PaddyTable({
    data,
    search,
    navigate,
    pagination: serverPagination,
}: DataTableProps) {
    const columns = usePaddyColumns()
    // Local UI-only states
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    )
    const [sorting, setSorting] = useState<SortingState>([])

    // Only handle column filters (pagination is server-side)
    const {
        columnFilters,
        onColumnFiltersChange,
        pagination,
        onPaginationChange,
        ensurePageInRange,
    } = useTableUrlState({
        search,
        navigate,
        pagination: {
            pageKey: 'page',
            pageSizeKey: 'limit',
            defaultPage: 1,
            defaultPageSize: 10,
            allowedPageSizes: [10, 20, 30, 40, 50],
        },
        globalFilter: { enabled: false },
        columnFilters: [
            { columnId: 'partyName', searchKey: 'search', type: 'string' },
        ],
    })

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        getRowId: (row) => row._id || '',
        state: {
            sorting,
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
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    useEffect(() => {
        if (!serverPagination) {
            ensurePageInRange(table.getPageCount())
        }
    }, [table, ensurePageInRange, serverPagination])

    return (
        <div
            className={cn(
                'max-sm:has-[div[role="toolbar"]]:mb-16',
                'flex flex-1 flex-col gap-4'
            )}
        >
            <DataTableToolbar
                table={table}
                searchPlaceholder='Filter purchases...'
                searchKey='partyName'
                filters={[]}
            />
            <div className='overflow-hidden rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className='group/row'
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className={cn(
                                                'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                                                header.column.columnDef.meta
                                                    ?.className,
                                                header.column.columnDef.meta
                                                    ?.thClassName
                                            )}
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
                                    className='group/row'
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cn(
                                                'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                                                cell.column.columnDef.meta
                                                    ?.className,
                                                cell.column.columnDef.meta
                                                    ?.tdClassName
                                            )}
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} className='mt-auto' />
            <DataTableBulkActions table={table} />
        </div>
    )
}
