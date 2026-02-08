export const customStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: 'hsl(var(--background))',
        borderColor: state.isFocused
            ? 'hsl(var(--primary))'
            : 'hsl(var(--border))',
        borderRadius: '0.375rem',
        borderWidth: '1px',
        boxShadow: state.isFocused ? '0 0 0 1px hsl(var(--primary))' : 'none',
        '&:hover': {
            borderColor: state.isFocused
                ? 'hsl(var(--primary))'
                : 'hsl(var(--border))',
        },
        minHeight: '40px',
        fontSize: '0.875rem',
        padding: '0 12px',
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? 'hsl(var(--primary))'
            : state.isFocused
              ? 'hsl(var(--secondary))'
              : 'hsl(var(--background))',
        color: state.isSelected
            ? 'hsl(var(--primary-foreground))'
            : 'hsl(var(--foreground))',
        padding: '12px',
        cursor: 'pointer',
        fontSize: '0.875rem',
    }),
    menu: (provided: any) => ({
        ...provided,
        marginTop: '4px',
        borderRadius: '0.375rem',
        border: '1px solid hsl(var(--border))',
        boxShadow:
            '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        maxHeight: '300px',
        overflow: 'hidden',
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: 'hsl(var(--muted-foreground))',
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: 'hsl(var(--foreground))',
    }),
    loadingIndicator: (provided: any) => ({
        ...provided,
        padding: '8px 12px',
    }),
    loadingMessage: (provided: any) => ({
        ...provided,
        padding: '14px',
        textAlign: 'center',
        color: 'hsl(var(--muted-foreground))',
    }),
    noOptionsMessage: (provided: any) => ({
        ...provided,
        padding: '14px',
        textAlign: 'center',
        color: 'hsl(var(--muted-foreground))',
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        padding: '4px',
        color: 'hsl(var(--muted-foreground))',
        '&:hover': {
            color: 'hsl(var(--foreground))',
        },
    }),
    clearIndicator: (provided: any) => ({
        ...provided,
        padding: '4px',
        color: 'hsl(var(--muted-foreground))',
        '&:hover': {
            color: 'hsl(var(--destructive))',
        },
    }),
    input: (provided: any) => ({
        ...provided,
        color: 'hsl(var(--foreground))',
        '&::placeholder': {
            color: 'hsl(var(--muted-foreground))',
        },
    }),
    multiValue: () => ({}), // Hide multi-value styling since no checkboxes
    multiValueLabel: () => ({}),
    multiValueRemove: () => ({}),
}
