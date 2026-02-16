'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { PasswordInput } from '@/components/password-input'
import { useCreateStaff, useUpdateStaff } from '../data/hooks'
import { type Staff } from '../data/schema'

// Module and action constants
const MODULE_CATEGORIES = [
    // {
    //     title: 'Dashboard',
    //     modules: [
    //         { slug: 'dashboard-overview', label: 'Overview' },
    //     ],
    // },
    {
        title: 'Purchase Reports',
        modules: [
            { slug: 'paddy-purchase-report', label: 'Paddy Purchase' },
            { slug: 'rice-purchase-report', label: 'Rice Purchase' },
            { slug: 'gunny-purchase-report', label: 'Gunny Purchase' },
            { slug: 'frk-purchase-report', label: 'FRK Purchase' },
            { slug: 'other-purchase-report', label: 'Other Purchase' },
        ],
    },
    {
        title: 'Staff Management',
        modules: [{ slug: 'staff-directory', label: 'Staff Directory' }],
    },
    {
        title: 'Sales Reports',
        modules: [
            { slug: 'rice-sales-report', label: 'Rice Sales' },
            { slug: 'paddy-sales-report', label: 'Paddy Sales' },
            { slug: 'gunny-sales-report', label: 'Gunny Sales' },
            { slug: 'khanda-sales-report', label: 'Khanda Sales' },
            { slug: 'nakkhi-sales-report', label: 'Nakkhi Sales' },
            { slug: 'other-sales-report', label: 'Other Sales' },
        ],
    },
    {
        title: 'Master Reports',
        modules: [
            { slug: 'party-report', label: 'Party' },
            { slug: 'transporter-report', label: 'Transporter' },
            { slug: 'broker-report', label: 'Broker' },
            { slug: 'committee-report', label: 'Committee' },
            { slug: 'do-report', label: 'DO' },
            { slug: 'vehicle-report', label: 'Vehicle' },
            { slug: 'staff-report', label: 'Staff' },
            { slug: 'labour-group-report', label: 'Labour Group' },
        ],
    },
    {
        title: 'Daily & Stock',
        modules: [
            { slug: 'daily-reports-overview', label: 'Overview' },
            { slug: 'daily-receipt', label: 'Receipt' },
            { slug: 'daily-payment', label: 'Payment' },
            { slug: 'stock-overview', label: 'Stock Overview' },
        ],
    },
    {
        title: 'Transactions & Lifting',
        modules: [
            { slug: 'broker-transaction', label: 'Broker Trans.' },
            { slug: 'party-transaction', label: 'Party Trans.' },
            {
                slug: 'balance-lifting-paddy-purchase',
                label: 'Lifting Paddy (P)',
            },
            {
                slug: 'balance-lifting-rice-purchase',
                label: 'Lifting Rice (P)',
            },
            {
                slug: 'balance-lifting-gunny-purchase',
                label: 'Lifting Gunny (P)',
            },
            { slug: 'balance-lifting-frk-purchase', label: 'Lifting FRK (P)' },
            { slug: 'balance-lifting-paddy-sales', label: 'Lifting Paddy (S)' },
            {
                slug: 'outward-balance-lifting-rice-sales',
                label: 'Lifting Rice (Out)',
            },
        ],
    },
    {
        title: 'Inward Operations',
        modules: [
            { slug: 'inward-govt-paddy', label: 'Govt Paddy' },
            { slug: 'inward-private-paddy', label: 'Private Paddy' },
            { slug: 'inward-rice', label: 'Rice' },
            { slug: 'inward-gunny', label: 'Gunny' },
            { slug: 'inward-other', label: 'Other' },
            { slug: 'inward-frk', label: 'FRK' },
        ],
    },
    {
        title: 'Outward Operations',
        modules: [
            { slug: 'outward-private-paddy', label: 'Private Paddy' },
            { slug: 'outward-private-rice', label: 'Private Rice' },
            { slug: 'outward-govt-rice', label: 'Govt Rice' },
            { slug: 'outward-govt-gunny', label: 'Govt Gunny' },
            { slug: 'outward-private-gunny', label: 'Private Gunny' },
            { slug: 'outward-frk', label: 'FRK' },
            { slug: 'outward-khanda', label: 'Khanda' },
            { slug: 'outward-nakkhi', label: 'Nakkhi' },
            { slug: 'outward-bhusa', label: 'Bhusa' },
            { slug: 'outward-kodha', label: 'Kodha' },
            { slug: 'outward-silky-kodha', label: 'Silky Kodha' },
            { slug: 'outward-other', label: 'Other' },
        ],
    },
    {
        title: 'Labour & Milling',
        modules: [
            { slug: 'paddy-milling-report', label: 'Paddy Milling' },
            { slug: 'rice-milling-report', label: 'Rice Milling' },
            { slug: 'inward-labour-cost-report', label: 'Inward Labour' },
            { slug: 'outward-labour-cost-report', label: 'Outward Labour' },
            { slug: 'milling-labour-cost-report', label: 'Milling Labour' },
            { slug: 'other-labour-cost-report', label: 'Other Labour' },
        ],
    },
    {
        title: 'Finance',
        modules: [
            { slug: 'financial-receipt-report', label: 'Finance Receipt' },
            { slug: 'financial-payment-report', label: 'Finance Payment' },
        ],
    },
]

const ACTIONS = [
    { value: 'view', label: 'View' },
    { value: 'create', label: 'Create' },
    { value: 'edit', label: 'Edit' },
    { value: 'delete', label: 'Delete' },
] as const

const permissionSchema = z.object({
    moduleSlug: z.string(),
    actions: z.array(z.string()),
})

const formSchema = z
    .object({
        fullName: z
            .string()
            .min(2, 'Full Name must be at least 2 characters.')
            .max(100, 'Full Name must be at most 100 characters.'),
        phoneNumber: z.string().optional(),
        email: z.string().email('Invalid email address.'),
        password: z.string().transform((pwd) => pwd.trim()),
        confirmPassword: z.string().transform((pwd) => pwd.trim()),
        post: z.string().optional(),
        salary: z.union([z.string(), z.number()]).optional(),
        address: z.string().optional(),
        permissions: z.array(permissionSchema),
        isActive: z.boolean(),
        isEdit: z.boolean(),
    })
    .refine(
        (data) => {
            if (data.isEdit && !data.password) return true
            return data.password.length > 0
        },
        {
            message: 'Password is required.',
            path: ['password'],
        }
    )
    .refine(
        ({ isEdit, password }) => {
            if (isEdit && !password) return true
            return password.length >= 8
        },
        {
            message: 'Password must be at least 8 characters long.',
            path: ['password'],
        }
    )
    .refine(
        ({ isEdit, password, confirmPassword }) => {
            if (isEdit && !password) return true
            return password === confirmPassword
        },
        {
            message: "Passwords don't match.",
            path: ['confirmPassword'],
        }
    )

type StaffForm = z.infer<typeof formSchema>

type StaffActionDialogProps = {
    currentRow?: Staff
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function StaffActionDialog({
    currentRow,
    open,
    onOpenChange,
}: StaffActionDialogProps) {
    const { millId } = useParams<{ millId: string }>()
    const isEdit = !!currentRow

    const createMutation = useCreateStaff(millId || '')
    const updateMutation = useUpdateStaff(millId || '')

    const form = useForm<StaffForm>({
        resolver: zodResolver(formSchema),
        defaultValues: isEdit
            ? {
                  ...currentRow,
                  password: '',
                  confirmPassword: '',
                  post: currentRow?.post || '',
                  salary: currentRow?.salary || 0,
                  address: currentRow?.address || '',
                  permissions: currentRow?.permissions || [],
                  isActive: currentRow?.isActive ?? true,
                  isEdit,
              }
            : {
                  fullName: '',
                  email: '',
                  phoneNumber: '',
                  password: '',
                  confirmPassword: '',
                  post: '',
                  salary: 0,
                  address: '',
                  permissions: [],
                  isActive: true,
                  isEdit,
              },
    })

    const onSubmit = async (values: StaffForm) => {
        try {
            // Filter permissions to only include those with at least one action
            const filteredPermissions = values.permissions.filter(
                (p) => p.actions.length > 0
            )

            // Parse salary - convert string to number if needed
            const parsedSalary = values.salary
                ? typeof values.salary === 'string'
                    ? parseFloat(values.salary) || undefined
                    : values.salary
                : undefined

            if (isEdit && currentRow) {
                await updateMutation.mutateAsync({
                    id: currentRow._id,
                    fullName: values.fullName,
                    email: values.email,
                    phoneNumber: values.phoneNumber || '',
                    post: values.post || undefined,
                    salary: parsedSalary,
                    address: values.address || undefined,
                    permissions: filteredPermissions,
                    isActive: values.isActive,
                })
            } else {
                await createMutation.mutateAsync({
                    fullName: values.fullName,
                    email: values.email,
                    phoneNumber: values.phoneNumber || '',
                    password: values.password,
                    post: values.post || undefined,
                    salary: parsedSalary,
                    address: values.address || undefined,
                    permissions: filteredPermissions,
                    isActive: values.isActive,
                })
            }
            form.reset()
            onOpenChange(false)
        } catch (error) {
            console.error('Staff operation failed:', error)
        }
    }

    // Helper function to toggle permission action
    const togglePermissionAction = (moduleSlug: string, action: string) => {
        const currentPermissions = form.getValues('permissions') || []
        const moduleIndex = currentPermissions.findIndex(
            (p) => p.moduleSlug === moduleSlug
        )

        if (moduleIndex === -1) {
            form.setValue(
                'permissions',
                [...currentPermissions, { moduleSlug, actions: [action] }],
                { shouldDirty: true }
            )
        } else {
            const modulePermission = { ...currentPermissions[moduleIndex] }
            const actionIndex = modulePermission.actions.indexOf(action)

            if (actionIndex === -1) {
                modulePermission.actions = [...modulePermission.actions, action]
            } else {
                modulePermission.actions = modulePermission.actions.filter(
                    (a) => a !== action
                )
            }

            const newPermissions = [...currentPermissions]
            newPermissions[moduleIndex] = modulePermission
            form.setValue('permissions', newPermissions, { shouldDirty: true })
        }
    }

    // Helper to toggle all modules in a category
    const toggleCategory = (
        categoryModules: { slug: string }[],
        select: boolean
    ) => {
        const currentPermissions = form.getValues('permissions') || []
        let newPermissions = [...currentPermissions]

        categoryModules.forEach((module) => {
            const index = newPermissions.findIndex(
                (p) => p.moduleSlug === module.slug
            )
            if (select) {
                if (index === -1) {
                    newPermissions.push({
                        moduleSlug: module.slug,
                        actions: ['view', 'create', 'edit', 'delete'],
                    })
                } else {
                    newPermissions[index] = {
                        moduleSlug: module.slug,
                        actions: ['view', 'create', 'edit', 'delete'],
                    }
                }
            } else {
                if (index !== -1) {
                    newPermissions = newPermissions.filter(
                        (p) => p.moduleSlug !== module.slug
                    )
                }
            }
        })

        form.setValue('permissions', newPermissions, { shouldDirty: true })
    }

    // Helper to check if an action is selected for a module
    const isActionSelected = (moduleSlug: string, action: string) => {
        const permissions = form.watch('permissions') || []
        const modulePermission = permissions.find(
            (p) => p.moduleSlug === moduleSlug
        )
        return modulePermission?.actions.includes(action) ?? false
    }

    const isPasswordTouched = !!form.formState.dirtyFields.password

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                form.reset()
                onOpenChange(state)
            }}
        >
            <DialogContent className='flex max-h-[90vh] max-w-4xl flex-col'>
                <DialogHeader className='text-start'>
                    <DialogTitle>
                        {isEdit ? 'Edit Staff' : 'Add New Staff'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update the staff member here. '
                            : 'Create new staff member here. '}
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className='flex-1 overflow-y-auto py-4 pe-2'>
                    <Form {...form}>
                        <form
                            id='staff-form'
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-6'
                        >
                            <div className='grid grid-cols-2 gap-6'>
                                {/* Left Column */}
                                <div className='space-y-4'>
                                    <FormField
                                        control={form.control}
                                        name='fullName'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='John Doe'
                                                        autoComplete='off'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='email'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='john.doe@gmail.com'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='phoneNumber'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Phone Number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='+123456789'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='password'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <PasswordInput
                                                        placeholder='e.g., S3cur3P@ssw0rd'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='confirmPassword'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Confirm Password
                                                </FormLabel>
                                                <FormControl>
                                                    <PasswordInput
                                                        disabled={
                                                            !isPasswordTouched
                                                        }
                                                        placeholder='e.g., S3cur3P@ssw0rd'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Right Column */}
                                <div className='space-y-4'>
                                    <FormField
                                        control={form.control}
                                        name='post'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Post</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='e.g., Senior Accountant'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='salary'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Salary</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        placeholder='e.g., 50000'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='address'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='e.g., 123 Main St'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='isActive'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            field.onChange(
                                                                value ===
                                                                    'active'
                                                            )
                                                        }
                                                        defaultValue={
                                                            field.value
                                                                ? 'active'
                                                                : 'inactive'
                                                        }
                                                        className='flex gap-4'
                                                    >
                                                        <div className='flex items-center space-x-2'>
                                                            <RadioGroupItem
                                                                value='active'
                                                                id='active'
                                                            />
                                                            <Label htmlFor='active'>
                                                                Active
                                                            </Label>
                                                        </div>
                                                        <div className='flex items-center space-x-2'>
                                                            <RadioGroupItem
                                                                value='inactive'
                                                                id='inactive'
                                                            />
                                                            <Label htmlFor='inactive'>
                                                                Inactive
                                                            </Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Permissions Section */}
                            <div className='space-y-4'>
                                <div className='flex items-center justify-between border-b pb-2'>
                                    <h3 className='text-lg font-semibold'>
                                        Module Permissions
                                    </h3>
                                    <div className='flex gap-2'>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            onClick={() =>
                                                toggleCategory(
                                                    MODULE_CATEGORIES.flatMap(
                                                        (c) => c.modules
                                                    ),
                                                    true
                                                )
                                            }
                                        >
                                            Select All
                                        </Button>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            onClick={() =>
                                                form.setValue(
                                                    'permissions',
                                                    [],
                                                    { shouldDirty: true }
                                                )
                                            }
                                        >
                                            Clear All
                                        </Button>
                                    </div>
                                </div>

                                <div className='space-y-6'>
                                    {MODULE_CATEGORIES.map((category) => (
                                        <div
                                            key={category.title}
                                            className='space-y-4 rounded-xl border bg-card p-5 shadow-sm'
                                        >
                                            <div className='flex items-center justify-between border-b border-muted pb-3'>
                                                <h4 className='flex items-center gap-2 font-bold text-primary'>
                                                    <span className='h-2 w-2 rounded-full bg-primary' />
                                                    {category.title}
                                                </h4>
                                                <div className='flex gap-2'>
                                                    <Button
                                                        type='button'
                                                        variant='secondary'
                                                        size='sm'
                                                        className='h-7 px-3 text-[10px]'
                                                        onClick={() =>
                                                            toggleCategory(
                                                                category.modules,
                                                                true
                                                            )
                                                        }
                                                    >
                                                        Select All
                                                    </Button>
                                                    <Button
                                                        type='button'
                                                        variant='ghost'
                                                        size='sm'
                                                        className='h-7 px-3 text-[10px]'
                                                        onClick={() =>
                                                            toggleCategory(
                                                                category.modules,
                                                                false
                                                            )
                                                        }
                                                    >
                                                        Clear
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className='divide-y divide-muted/50'>
                                                {category.modules.map(
                                                    (module) => (
                                                        <div
                                                            key={module.slug}
                                                            className='flex items-center justify-between py-3 first:pt-0 last:pb-0'
                                                        >
                                                            <Label className='text-sm font-medium text-foreground/80'>
                                                                {module.label}
                                                            </Label>
                                                            <div className='flex items-center gap-4 sm:gap-6'>
                                                                {ACTIONS.map(
                                                                    (
                                                                        action
                                                                    ) => (
                                                                        <div
                                                                            key={`${module.slug}-${action.value}`}
                                                                            className='flex items-center gap-2'
                                                                        >
                                                                            <Checkbox
                                                                                id={`${module.slug}-${action.value}`}
                                                                                checked={isActionSelected(
                                                                                    module.slug,
                                                                                    action.value
                                                                                )}
                                                                                onCheckedChange={() =>
                                                                                    togglePermissionAction(
                                                                                        module.slug,
                                                                                        action.value
                                                                                    )
                                                                                }
                                                                                className='h-4 w-4 transition-all data-[state=checked]:bg-primary'
                                                                            />
                                                                            <Label
                                                                                htmlFor={`${module.slug}-${action.value}`}
                                                                                className='cursor-pointer text-[11px] font-medium text-muted-foreground transition-colors select-none hover:text-primary'
                                                                            >
                                                                                {
                                                                                    action.label
                                                                                }
                                                                            </Label>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
                <DialogFooter className='border-t pt-4'>
                    <Button
                        type='submit'
                        form='staff-form'
                        className='w-full sm:w-auto'
                        disabled={
                            createMutation.isPending || updateMutation.isPending
                        }
                    >
                        {createMutation.isPending || updateMutation.isPending
                            ? 'Saving...'
                            : isEdit
                              ? 'Save Changes'
                              : 'Create Staff Member'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
