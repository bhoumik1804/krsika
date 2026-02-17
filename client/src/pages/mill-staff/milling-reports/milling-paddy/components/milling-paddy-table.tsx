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
import { paddyTypeOptions } from '@/constants/purchase-form'
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
import { type MillingPaddy } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { useMillingPaddyColumns } from './milling-paddy-columns'

type DataTableProps = {
    data: MillingPaddy[]
    search: Record<string, unknown>
    navigate: NavigateFn
    pagination?: {
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

export function MillingPaddyTable({
    data,
    search,
    navigate,
    pagination: serverPagination,
}: DataTableProps) {
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    )
    const [sorting, setSorting] = useState<SortingState>([])
    const columns = useMillingPaddyColumns()

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
            { columnId: 'paddyType', searchKey: 'paddyType', type: 'string' },
        ],
    })

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination,
            rowSelection,
            columnFilters,
            columnVisibility,
        },
        getRowId: (row) => row._id || '',
        pageCount: serverPagination?.totalPages ?? -1,
        manualPagination: !!serverPagination,
        enableRowSelection: true,
        onPaginationChange,
        onColumnFiltersChange,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    useEffect(() => {
        ensurePageInRange(table.getPageCount())
    }, [table, ensurePageInRange])

    return (
        <div
            className={cn(
                'max-sm:has-[div[role="toolbar"]]:mb-16',
                'flex flex-1 flex-col gap-4'
            )}
        >
            <DataTableToolbar
                table={table}
                searchPlaceholder='Search...'
                searchKey='paddyType'
                filters={[
                    {
                        columnId: 'paddyType',
                        title: 'Paddy Type',
                        options: paddyTypeOptions,
                    },
                ]}
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
