'use client'

import { useState } from 'react'
import { customStyles } from '@/styles/react-select-styles'
import { Loader } from 'lucide-react'
// import Select, { components, SingleValue } from 'react-select'
import Select from 'react-select'
import { cn } from '@/lib/utils'

type Item = { label: string; value: string }

interface SearchableSelectProps {
    onValueChange?: (value: string) => void
    defaultValue?: string | undefined
    value?: string | undefined
    placeholder?: string
    isPending?: boolean
    items: Item[] | undefined
    disabled?: boolean
    className?: string
    isSearchable?: boolean
    isClearable?: boolean
}

export function SearchableSelect({
    defaultValue,
    value: controlledValue,
    onValueChange,
    isPending = false,
    items = [],
    placeholder = 'Select',
    disabled = false,
    className = '',
    isSearchable = true,
    isClearable = true,
}: SearchableSelectProps) {
    const [internalValue, setInternalValue] = useState(
        controlledValue || defaultValue || ''
    )

    const options = items.map((item) => ({
        label: item.label,
        value: item.value,
    }))

    const selectedOption = options.find((opt) => opt.value === internalValue)

    const handleChange = (selected: any) => {
        const newValue = selected?.value || ''
        setInternalValue(newValue)
        onValueChange?.(newValue)
    }

    const isLoading = isPending || !items.length

    return (
        <div className={cn('w-full', className)}>
            <Select
                isDisabled={disabled}
                isLoading={isLoading}
                isSearchable={isSearchable}
                isClearable={isClearable}
                options={options}
                value={selectedOption}
                onChange={handleChange}
                placeholder={placeholder}
                styles={customStyles}
                components={{
                    LoadingIndicator: () => (
                        <div className='flex items-center justify-center gap-2 p-3'>
                            <Loader className='h-5 w-5 animate-spin' />
                            <span>Loading...</span>
                        </div>
                    ),
                    DropdownIndicator: null, // Remove default dropdown arrow to match shadcn
                }}
                noOptionsMessage={() => 'No options available'}
                formatOptionLabel={(option: any) => option.label}
                classNamePrefix='react-select'
            />
        </div>
    )
}
