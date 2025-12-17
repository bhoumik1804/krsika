import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import TablePagination from "@/components/ui/table-pagination"
import { cn } from "@/lib/utils"

/**
 * Filter component for individual column filtering
 */
function Filter({ column }) {
    const columnFilterValue = column.getFilterValue()
    const { filterVariant } = column.columnDef.meta || {}
    const columnHeader = typeof column.columnDef.header === 'string' ? column.columnDef.header : ''

    const sortedUniqueValues = React.useMemo(() => {
        if (filterVariant === 'dropdown') {
            const values = Array.from(column.getFacetedUniqueValues().keys())
            return Array.from(new Set(values)).sort()
        }
        return []
    }, [column.getFacetedUniqueValues(), filterVariant])

    // Dropdown variant
    if (filterVariant === 'dropdown') {
        return (
            <div className="space-y-2">
                <Label className="text-sm font-medium">{columnHeader}</Label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-between"
                        >
                            <span className={cn(columnFilterValue ? "" : "text-muted-foreground", "truncate")}>
                                {columnFilterValue ? String(columnFilterValue) : `Filter ${columnHeader}`}
                            </span>
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-44 max-h-[300px] overflow-y-auto">
                        {sortedUniqueValues.map(value => (
                            <DropdownMenuItem
                                key={String(value)}
                                onClick={() => column.setFilterValue(value)}
                            >
                                {String(value)}
                            </DropdownMenuItem>
                        ))}
                        {columnFilterValue && (
                            <>
                                <div className="h-px bg-border my-1" />
                                <DropdownMenuItem
                                    className="text-muted-foreground"
                                    onClick={() => column.setFilterValue(undefined)}
                                >
                                    Clear Filter
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
    }

    // Default text filter
    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium">{columnHeader}</Label>
            <div className="relative">
                <Input
                    className="pl-9"
                    value={columnFilterValue ?? ''}
                    onChange={e => column.setFilterValue(e.target.value)}
                    placeholder={`Search ${columnHeader.toLowerCase()}`}
                    type="text"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                </div>
            </div>
        </div>
    )
}

export function DataTable({
    columns,
    data,
    showFilters = true,
}) {
    const [sorting, setSorting] = React.useState([])
    const [columnFilters, setColumnFilters] = React.useState([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            pagination,
        },
    })

    return (
        <div className="w-full space-y-4">
            {/* Filters Section */}
            {showFilters && (
                <div className="flex flex-wrap gap-3">
                    {table.getAllColumns()
                        .filter(column => column.getCanFilter() && column.columnDef.meta?.filterVariant)
                        .map(column => (
                            <div key={column.id} className="w-44">
                                <Filter column={column} />
                            </div>
                        ))}
                </div>
            )}

            {/* Table */}
            <div className="rounded-lg border border-border shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="bg-muted/70">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="px-4 py-3.5">
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={
                                                        header.column.getCanSort()
                                                            ? "flex items-center gap-2 cursor-pointer select-none"
                                                            : ""
                                                    }
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {header.column.getCanSort() && (
                                                        <span className="text-muted-foreground">
                                                            {{
                                                                asc: <ChevronUp className="h-4 w-4" />,
                                                                desc: <ChevronDown className="h-4 w-4" />,
                                                            }[header.column.getIsSorted()] ?? (
                                                                    <ChevronsUpDown className="h-4 w-4" />
                                                                )}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </tr>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-accent/50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4 py-3">
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
                                    className="h-24 text-center"
                                >
                                    <div className="empty-state py-12">
                                        <p className="empty-state-title">No results found</p>
                                        <p className="empty-state-desc">
                                            Try adjusting your search to find what you're looking for
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
