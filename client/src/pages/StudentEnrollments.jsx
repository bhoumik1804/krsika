import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon, EllipsisHorizontalIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { DataTable } from '@/components/ui/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useStudents } from '@/hooks/useStudents';
import { setPageIndex, setPageSize } from '@/store/slices/tableSlice';
import TablePagination from '@/components/ui/table-pagination';

export default function StudentEnrollments() {
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { students, totalPages, currentPage, isLoading, isError, error } = useStudents();
    const { t } = useTranslation(['students', 'common']);

    // Table column definitions with translations
    const columns = [
        {
            accessorKey: 'fullName',
            header: t('students:columns.fullName'),
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('fullName')}</div>
            ),
        },
        {
            accessorKey: 'email',
            header: t('students:columns.email'),
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="text-sm">{row.getValue('email')}</div>
            ),
        },
        {
            accessorKey: 'courseName',
            header: t('students:columns.course'),
            meta: { filterVariant: 'dropdown' },
            cell: ({ row }) => <div>{row.getValue('courseName')}</div>,
        },
        {
            accessorKey: 'collegeName',
            header: t('students:columns.college'),
            meta: { filterVariant: 'dropdown' },
            cell: ({ row }) => <div>{row.getValue('collegeName')}</div>,
        },
        {
            accessorKey: 'yearOfStudy',
            header: t('students:columns.year'),
            meta: { filterVariant: 'dropdown' },
            cell: ({ row }) => <div>{t('students:columns.year')} {row.getValue('yearOfStudy')}</div>,
        },
        {
            accessorKey: 'createdAt',
            header: t('students:columns.enrolledDate'),
            cell: ({ row }) => {
                const date = new Date(row.getValue('createdAt'));
                return <div className="text-sm">{date.toLocaleDateString()}</div>;
            },
        },
        {
            id: 'actions',
            header: t('students:columns.actions'),
            enableColumnFilter: false,
            cell: ({ row }) => {
                const student = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <EllipsisHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast.info(t('students:actions.view'), { description: t('students:actions.viewStudent', { name: student.fullName }) })}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                {t('students:actions.view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info(t('students:actions.edit'), { description: t('students:actions.editStudent', { name: student.fullName }) })}>
                                <PencilIcon className="mr-2 h-4 w-4" />
                                {t('students:actions.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => toast.error(t('students:actions.delete'), { description: t('students:actions.deleteStudent', { name: student.fullName }) })}
                                className="text-destructive focus:text-destructive"
                            >
                                <TrashIcon className="mr-2 h-4 w-4" />
                                {t('students:actions.delete')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
                <div className="flex flex-col items-center gap-3">
                    <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">{t('students:loadingMessage')}</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
                <p className="text-destructive mb-2 font-semibold">{t('students:errorMessage')}</p>
                <p className="text-muted-foreground text-sm">{error?.message || t('students:somethingWentWrong')}</p>
                <Button
                    onClick={() => window.location.reload()}
                    className="mt-4"
                    variant="outline"
                >
                    {t('common:buttons.retry')}
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-2">
            <Card className={"py-0"}>
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={students}
                        showFilters={true}
                    />

                    <TablePagination
                        pageIndex={pageIndex}
                        pageCount={totalPages}
                        pageSize={pageSize}
                        setPageIndex={(index) => dispatch(setPageIndex(index))}
                        setPageSize={(size) => dispatch(setPageSize(size))}
                        canPreviousPage={currentPage > 1}
                        canNextPage={currentPage < totalPages}
                        previousPage={() => dispatch(setPageIndex(Math.max(0, pageIndex - 1)))}
                        nextPage={() => dispatch(setPageIndex(pageIndex + 1))}
                        paginationItemsToDisplay={5}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
