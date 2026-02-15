import { Loader } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PaginatedListResult } from '@/hooks/use-paginated-list'
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxList,
    ComboboxEmpty,
    ComboboxCollection,
} from '@/components/ui/combobox'

// ==========================================
// Types
// ==========================================

interface PaginatedComboboxProps {
    /** Current selected value */
    value?: string
    /** Callback when value changes */
    onValueChange: (value: string) => void
    /** Result from usePaginatedList hook */
    paginatedList: PaginatedListResult
    /** Placeholder text for the search input */
    placeholder?: string
    /** Text shown when no items match the search */
    emptyText?: string
    /** Whether to show the clear button */
    showClear?: boolean
    /** Additional class names */
    className?: string
}

// ==========================================
// Component
// ==========================================

/**
 * A ready-to-use paginated Combobox that works with usePaginatedList.
 *
 * @example
 * const committee = usePaginatedList(millId, open, {
 *     useListHook: useCommitteeList,
 *     extractItems: (d) => d.committees.map(c => c.committeeName),
 * }, currentRow?.samitiSangrahan)
 *
 * <PaginatedCombobox
 *     value={field.value}
 *     onValueChange={field.onChange}
 *     paginatedList={committee}
 *     placeholder="Search committee..."
 *     emptyText="No committees found"
 * />
 */
export function PaginatedCombobox({
    value,
    onValueChange,
    paginatedList,
    placeholder = 'Search...',
    emptyText = 'No items found',
    showClear = true,
    className,
}: PaginatedComboboxProps) {
    return (
        <Combobox
            value={value ?? ''}
            onValueChange={(val) => onValueChange(val ?? '')}
            items={paginatedList.items}
        >
            <ComboboxInput placeholder={placeholder} showClear={showClear} />
            <ComboboxContent>
                <ComboboxList onScroll={paginatedList.onScroll}>
                    <ComboboxCollection>
                        {(item) => (
                            <ComboboxItem value={item}>{item}</ComboboxItem>
                        )}
                    </ComboboxCollection>
                    <ComboboxEmpty>{emptyText}</ComboboxEmpty>
                    {paginatedList.isLoadingMore && (
                        <div
                            className={cn(
                                'flex items-center justify-center py-2 text-xs text-muted-foreground',
                                className
                            )}
                        >
                            <Loader className='h-6 w-6 animate-spin text-muted-foreground' />
                        </div>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}
