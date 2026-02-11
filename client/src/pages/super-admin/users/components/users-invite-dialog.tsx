import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MailPlus, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
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
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import { roles } from '../data/data'
import { useInviteUser } from '../data/hooks'
import { handleFormError } from '@/lib/handle-form-error'
import { handleServerError } from '@/lib/handle-server-error'

const formSchema = z.object({
    email: z.string().email('Please enter a valid email address.'),
    role: z.string().min(1, 'Role is required.'),
    desc: z.string().optional(),
})

type UserInviteForm = z.infer<typeof formSchema>

type UserInviteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UsersInviteDialog({
    open,
    onOpenChange,
}: UserInviteDialogProps) {
    const inviteUser = useInviteUser()

    const form = useForm<UserInviteForm>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: '', role: '', desc: '' },
    })

    const onSubmit = async (values: UserInviteForm) => {
        try {
            await inviteUser.mutateAsync({
                email: values.email,
                role: values.role as
                    | 'super-admin'
                    | 'mill-admin'
                    | 'mill-staff'
                    | 'guest-user',
            })
            form.reset()
            onOpenChange(false)
        } catch (error) {
            const handled = handleFormError(error, form)
            if (!handled) {
                handleServerError(error)
            }
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                form.reset()
                onOpenChange(state)
            }}
        >
            <DialogContent className='sm:max-w-md'>
                <DialogHeader className='text-start'>
                    <DialogTitle className='flex items-center gap-2'>
                        <MailPlus /> Invite User
                    </DialogTitle>
                    <DialogDescription>
                        Invite new user to join your team by sending them an
                        email invitation. Assign a role to define their access
                        level.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        id='user-invite-form'
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='email'
                                            placeholder='eg: john.doe@gmail.com'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='role'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <SelectDropdown
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                        placeholder='Select a role'
                                        items={roles.map(
                                            ({ label, value }) => ({
                                                label,
                                                value,
                                            })
                                        )}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='desc'
                            render={({ field }) => (
                                <FormItem className=''>
                                    <FormLabel>
                                        Description (optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className='resize-none'
                                            placeholder='Add a personal note to your invitation (optional)'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter className='gap-y-2'>
                    <DialogClose asChild>
                        <Button variant='outline'>Cancel</Button>
                    </DialogClose>
                    <Button
                        type='submit'
                        form='user-invite-form'
                        disabled={inviteUser.isPending}
                    >
                        {inviteUser.isPending ? 'Inviting...' : 'Invite'}{' '}
                        <Send />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
