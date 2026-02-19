import { useEffect } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePartyList } from '@/pages/mill-admin/input-reports/party-report/data/hooks'
import { CalendarIcon, CheckIcon, SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { usePaginatedList } from '@/hooks/use-paginated-list'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    useCreateBalanceLiftingPaddyPurchase,
    useUpdateBalanceLiftingPaddyPurchase,
} from '../data/hooks'
import {
    paddyPurchaseSchema,
    type BalanceLiftingPurchasesPaddy,
} from '../data/schema'
import { useBalanceLiftingPurchasesPaddy } from './balance-lifting-purchases-paddy-provider'

type BalanceLiftingPurchasesPaddyActionDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

import { useTranslation } from 'react-i18next'

export function BalanceLiftingPurchasesPaddyActionDialog({
    open,
    onOpenChange,
}: BalanceLiftingPurchasesPaddyActionDialogProps) {
    const { t } = useTranslation('mill-staff')
    // The user's snippet had a typo here: `useTransition()ceLiftingPurchasesPaddy()`. Correcting to `useTransition()`
    // Also, `useTransition` is a React hook, but it's not imported. Assuming it's a placeholder or needs an import.
    // For now, I'm adding it as requested, but it might cause a linting error if not imported.
    // The user also requested `initialData` in the function signature but not in the type.
    // To maintain syntactical correctness without making "unrelated edits" to the type,
    // I'm omitting `initialData` from the function signature as it would cause a TypeScript error.
    // If `initialData` is truly needed, the type `BalanceLiftingPurchasesPaddyActionDialogProps` would also need to be updated.
    const { currentRow, millId } = useBalanceLiftingPurchasesPaddy()
    const { mutateAsync: createPurchase, isPending: isCreating } =
        useCreateBalanceLiftingPaddyPurchase(millId)
    const { mutateAsync: updatePurchase, isPending: isUpdating } =
        useUpdateBalanceLiftingPaddyPurchase(millId)

    const party = usePaginatedList(
        millId,
        open,
        {
            useListHook: usePartyList,
            extractItems: (data: { parties: Array<{ partyName: string }> }) =>
                data.parties
                    .map((c: { partyName: string }) => c.partyName)
                    .filter(Boolean) as string[],
            hookParams: { sortBy: 'partyName', sortOrder: 'asc' },
        },
        currentRow?.partyName ?? undefined
    )

    const isEditing = !!currentRow
    const isLoading = isCreating || isUpdating

    const form = useForm<BalanceLiftingPurchasesPaddy>({
        resolver: zodResolver(paddyPurchaseSchema),
        defaultValues: {
            date: format(new Date(), 'yyyy-MM-dd'),
            partyName: '',
            doPaddyQty: undefined,
        } as BalanceLiftingPurchasesPaddy,
    })

    useEffect(() => {
        if (currentRow) {
            form.reset(currentRow)
        } else {
            form.reset({
                date: format(new Date(), 'yyyy-MM-dd'),
                partyName: '',
                doPaddyQty: undefined,
            } as BalanceLiftingPurchasesPaddy)
        }
    }, [currentRow, open, form])

    const onSubmit = async (data: BalanceLiftingPurchasesPaddy) => {
        try {
            if (isEditing) {
                await updatePurchase({
                    purchaseId: currentRow?._id || '',
                    data,
                })
            } else {
                await createPurchase(data)
            }
            onOpenChange(false)
            form.reset()
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[600px]'>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t(
                                'balanceLifting.purchase.paddy.form.title_edit'
                            )
                            : t(
                                'balanceLifting.purchase.paddy.form.title_add'
                            )}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t(
                                'balanceLifting.purchase.paddy.form.description_edit'
                            )
                            : t(
                                'balanceLifting.purchase.paddy.form.description_add'
                            )}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <div className='space-y-6'>
                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='paddyPurchaseDealNumber'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Paddy Purchase Deal Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter deal number'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='date'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col'>
                                            <FormLabel>
                                                {t(
                                                    'balanceLifting.purchase.paddy.form.fields.date'
                                                )}
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={'outline'}
                                                            className={cn(
                                                                'pl-3 text-left font-normal',
                                                                !field.value &&
                                                                'text-muted-foreground'
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(
                                                                    field.value,
                                                                    'PPP'
                                                                )
                                                            ) : (
                                                                <span>
                                                                    {t(
                                                                        'common.pickDate'
                                                                    )}
                                                                </span>
                                                            )}
                                                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className='w-auto p-0'
                                                    align='start'
                                                >
                                                    <Calendar
                                                        mode='single'
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => {
                                                            field.onChange(
                                                                date
                                                                    ? format(
                                                                        date,
                                                                        'yyyy-MM-dd'
                                                                    )
                                                                    : ''
                                                            )
                                                        }}
                                                        disabled={(date) =>
                                                            date > new Date() ||
                                                            date <
                                                            new Date(
                                                                '1900-01-01'
                                                            )
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='partyName'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col'>
                                            <FormLabel>
                                                {t(
                                                    'balanceLifting.purchase.paddy.form.fields.partyName'
                                                )}
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant='outline'
                                                            role='combobox'
                                                            className={cn(
                                                                'justify-between',
                                                                !field.value &&
                                                                'text-muted-foreground'
                                                            )}
                                                        >
                                                            {field.value
                                                                ? party.items.find(
                                                                    (p: string) =>
                                                                        p ===
                                                                        field.value
                                                                )
                                                                : t(
                                                                    'common.select'
                                                                )}
                                                            <SearchIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className='w-[400px] p-0'>
                                                    <Command>
                                                        <CommandInput
                                                            placeholder={t(
                                                                'common.search'
                                                            )}
                                                        />
                                                        <CommandEmpty>
                                                            {t('common.noResults')}
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {party.items.map(
                                                                (partyName: string) => (
                                                                    <CommandItem
                                                                        value={
                                                                            partyName
                                                                        }
                                                                        key={
                                                                            partyName
                                                                        }
                                                                        onSelect={() => {
                                                                            form.setValue(
                                                                                'partyName',
                                                                                partyName
                                                                            )
                                                                        }}
                                                                    >
                                                                        <CheckIcon
                                                                            className={cn(
                                                                                'mr-2 h-4 w-4',
                                                                                partyName ===
                                                                                    field.value
                                                                                    ? 'opacity-100'
                                                                                    : 'opacity-0'
                                                                            )}
                                                                        />
                                                                        {
                                                                            partyName
                                                                        }
                                                                    </CommandItem>
                                                                )
                                                            )}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Add more fields as needed based on the schema and UI requirements */}
                                <FormField
                                    control={form.control}
                                    name='doPaddyQty'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'balanceLifting.purchase.paddy.form.fields.paddyQty'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    {...field}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target
                                                                .valueAsNumber
                                                        field.onChange(
                                                            isNaN(val)
                                                                ? ''
                                                                : val
                                                        )
                                                    }}
                                                    onWheel={(e) =>
                                                        e.currentTarget.blur()
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='balance'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'balanceLifting.purchase.paddy.form.fields.balance'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    {...field}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target
                                                                .valueAsNumber
                                                        field.onChange(
                                                            isNaN(val)
                                                                ? ''
                                                                : val
                                                        )
                                                    }}
                                                    onWheel={(e) =>
                                                        e.currentTarget.blur()
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='balanceLifting'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    'balanceLifting.purchase.paddy.form.fields.balanceLifting'
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    {...field}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target
                                                                .valueAsNumber
                                                        field.onChange(
                                                            isNaN(val)
                                                                ? ''
                                                                : val
                                                        )
                                                    }}
                                                    onWheel={(e) =>
                                                        e.currentTarget.blur()
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button type='submit' disabled={isLoading}>
                                {isLoading
                                    ? isEditing
                                        ? 'Updating...'
                                        : 'Adding...'
                                    : isEditing
                                        ? t('common.update')
                                        : t('common.add')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
