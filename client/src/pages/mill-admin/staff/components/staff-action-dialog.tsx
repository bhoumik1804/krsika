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
const MODULES = [
    { slug: 'purchases', label: 'Purchases' },
    { slug: 'sales', label: 'Sales' },
    { slug: 'inward', label: 'Inward' },
    { slug: 'outward', label: 'Outward' },
    { slug: 'milling', label: 'Milling' },
] as const

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
        email: z.email({
            error: (iss) =>
                iss.input === '' ? 'Email is required.' : undefined,
        }),
        password: z.string().transform((pwd) => pwd.trim()),
        confirmPassword: z.string().transform((pwd) => pwd.trim()),
        role: z.string().optional(),
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
        ({ isEdit, password }) => {
            if (isEdit && !password) return true
            return /[a-z]/.test(password)
        },
        {
            message: 'Password must contain at least one lowercase letter.',
            path: ['password'],
        }
    )
    .refine(
        ({ isEdit, password }) => {
            if (isEdit && !password) return true
            return /\d/.test(password)
        },
        {
            message: 'Password must contain at least one number.',
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
                  role: currentRow?.role || '',
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
                  role: '',
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
                    role: values.role || undefined,
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
                    role: values.role || undefined,
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
            // Error is already handled by the mutation's onError
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
            // Module doesn't exist, add it with this action
            form.setValue('permissions', [
                ...currentPermissions,
                { moduleSlug, actions: [action] },
            ])
        } else {
            // Module exists, toggle the action
            const modulePermission = currentPermissions[moduleIndex]
            const actionIndex = modulePermission.actions.indexOf(action)

            if (actionIndex === -1) {
                // Add action
                modulePermission.actions.push(action)
            } else {
                // Remove action
                modulePermission.actions.splice(actionIndex, 1)
            }

            form.setValue('permissions', [...currentPermissions])
        }
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
            <DialogContent className='sm:max-w-3xl'>
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
                <div className='max-h-[70vh] w-full overflow-y-auto py-1 pe-3'>
                    <Form {...form}>
                        <form
                            id='staff-form'
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-4 px-0.5'
                        >
                            <div className='grid grid-cols-2 gap-4'>
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
                                        name='role'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Role</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='e.g., Manager'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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

                            {/* Permissions Section - Full Width */}
                            <div className='space-y-3 pt-2'>
                                <FormLabel className='text-sm font-medium'>
                                    Permissions
                                </FormLabel>
                                <div className='rounded-md border p-3'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        {MODULES.map((module) => (
                                            <div
                                                key={module.slug}
                                                className='space-y-2'
                                            >
                                                <Label className='text-sm font-medium'>
                                                    {module.label}
                                                </Label>
                                                <div className='flex flex-wrap gap-3'>
                                                    {ACTIONS.map((action) => (
                                                        <div
                                                            key={`${module.slug}-${action.value}`}
                                                            className='flex items-center space-x-2'
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
                                                            />
                                                            <Label
                                                                htmlFor={`${module.slug}-${action.value}`}
                                                                className='text-sm font-normal'
                                                            >
                                                                {action.label}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button
                        type='submit'
                        form='staff-form'
                        disabled={
                            createMutation.isPending || updateMutation.isPending
                        }
                    >
                        {createMutation.isPending || updateMutation.isPending
                            ? 'Saving...'
                            : isEdit
                              ? 'Save changes'
                              : 'Create Staff'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
