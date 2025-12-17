import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePagination } from '@/hooks/usePagination';
import { cn } from '@/lib/utils';

const pageSizes = [5, 10, 25, 50];

const Ellipsis = () => <span className="mx-2 select-none text-muted-foreground font-bold">...</span>;

function TablePagination({
    className = '',
    pageIndex,
    pageCount,
    pageSize,
    setPageIndex,
    setPageSize,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    paginationItemsToDisplay = 5,
}) {
    const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
        currentPage: pageIndex + 1,
        totalPages: pageCount,
        paginationItemsToDisplay,
    });

    return (
        <div
            className={cn(
                'flex items-center justify-between gap-3 max-sm:flex-col py-4',
                className,
            )}
        >
            {/* Page info */}
            <span className="text-muted-foreground text-sm whitespace-nowrap">
                Page <span className="text-foreground font-semibold">{pageIndex + 1}</span> of{' '}
                <span className="text-foreground font-semibold">{pageCount}</span>
            </span>
            {/* Pagination controls */}
            <div className="flex items-center gap-2">
                <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={previousPage}
                    disabled={!canPreviousPage}
                    aria-label="Go to previous page"
                >
                    <ChevronLeftIcon aria-hidden="true" />
                </Button>
                {showLeftEllipsis && <Ellipsis />}
                {pages.map(page => {
                    const isActive = page === pageIndex + 1;
                    return (
                        <Button
                            key={page}
                            size="icon"
                            variant={isActive ? 'outline' : 'ghost'}
                            onClick={() => setPageIndex(page - 1)}
                            aria-current={isActive ? 'page' : undefined}
                            className={cn(
                                isActive && 'font-bold'
                            )}
                        >
                            {page}
                        </Button>
                    );
                })}
                {showRightEllipsis && <Ellipsis />}
                <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={nextPage}
                    disabled={!canNextPage}
                    aria-label="Go to next page"
                >
                    <ChevronRightIcon aria-hidden="true" />
                </Button>
            </div>
            {/* Page size selector */}
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-fit whitespace-nowrap"
                        >
                            {pageSize} / page
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {pageSizes.map(ps => (
                            <DropdownMenuItem
                                key={ps}
                                onClick={() => setPageSize(ps)}
                            >
                                {ps} / page
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

export default TablePagination;
