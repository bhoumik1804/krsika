import { useEffect, useState } from 'react'
import {
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
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
import { type PartyTransaction } from '../data/schema'
import { partyTransactionReportColumns as columns } from './party-transaction-report-columns'
import { Loader2 } from 'lucide-react'

type DataTableProps = {
    data: PartyTransaction[]
    search: Record<string, unknown>
    navigate: NavigateFn
    loading?: boolean
    serverPagination?: { page: number; limit: number; total: number; totalPages: number }
}

export function PartyTransactionReportTable({
    data,
    search,
    navigate,
    loading = false,
    serverPagination,
}: DataTableProps) {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [sorting, setSorting] = useState<SortingState>([])

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
            { columnId: 'partyName', searchKey: 'partyName', type: 'string' },
        ],
    })

    const table = useReactTable({
        data,
        columns,
        getRowId: (row) => row._id,
        manualPagination: true,
        pageCount: serverPagination?.totalPages ?? 0,
        state: {
            sorting,
            pagination,
            columnFilters,
            columnVisibility,
        },
        onPaginationChange,
        onColumnFiltersChange,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    useEffect(() => {
        if (serverPagination?.totalPages != null) {
            ensurePageInRange(serverPagination.totalPages)
        }
    }, [serverPagination?.totalPages, ensurePageInRange])

    return (
        <div
            className={cn(
                'max-sm:has-[div[role="toolbar"]]:mb-16',
                'flex flex-1 flex-col gap-4'
            )}
        >
            <DataTableToolbar
                table={table}
                searchPlaceholder='Filter by party...'
                searchKey='partyName'
            />
            <div className='relative overflow-hidden rounded-md border'>
                {loading && (
                    <div className='absolute inset-0 z-10 flex items-center justify-center bg-background/60'>
                        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
                    </div>
                )}
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className='group/row'>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className={cn(
                                            'bg-background',
                                            header.column.columnDef.meta?.className,
                                            header.column.columnDef.meta?.thClassName
                                        )}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className='group/row'>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cn(
                                                'bg-background',
                                                cell.column.columnDef.meta?.className,
                                                cell.column.columnDef.meta?.tdClassName
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
                                    {loading ? 'Loading...' : 'No transactions found.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} className='mt-auto' />
        </div>
    )
}
