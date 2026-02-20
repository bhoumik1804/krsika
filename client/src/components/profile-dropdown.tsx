import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useUser } from '@/pages/landing/hooks/use-auth'
import { useAuthStore } from '@/stores/auth-store'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { type NavItem } from './layout/types'

interface ProfileDropdownProps {
    user?: {
        name: string
        email: string
        avatar: string
    }
    links?: NavItem[]
}

export function ProfileDropdown({ user, links }: ProfileDropdownProps) {
    const { user: authUser } = useUser()
    const storeUser = useAuthStore((state) => state.user)
    const { t } = useTranslation('mill-staff')
    const [open, setOpen] = useDialogState()
    const isMillStaff = authUser?.role === 'mill-staff'

    const getLabel = (label: string) => (isMillStaff ? t(label) : label)

    const displayName = storeUser?.fullName || authUser?.fullName || user?.name || ''
    const displayEmail = storeUser?.email || authUser?.email || user?.email || ''
    const displayAvatar = user?.avatar || ''
    const initials = displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        className='relative h-8 w-8 rounded-full'
                    >
                        <Avatar className='h-8 w-8'>
                            <AvatarImage
                                src={displayAvatar}
                                alt={`@${displayName}`}
                            />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end' forceMount>
                    <DropdownMenuLabel className='font-normal'>
                        <div className='flex flex-col gap-1.5'>
                            <p className='text-sm leading-none font-medium'>
                                {displayName}
                            </p>
                            <p className='text-xs leading-none text-muted-foreground'>
                                {displayEmail}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {links?.map((link) => (
                            <DropdownMenuItem key={link.title} asChild>
                                <Link to={link.url || '#'}>
                                    {getLabel(link.title)}
                                    {link.icon && (
                                        <DropdownMenuShortcut>
                                            <link.icon className='size-4' />
                                        </DropdownMenuShortcut>
                                    )}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant='destructive'
                        onClick={() => setOpen(true)}
                    >
                        {isMillStaff ? t('sidebar.signOut') : 'Sign out'}
                        {/* <DropdownMenuShortcut className='text-current'>
                            ⇧⌘Q
                        </DropdownMenuShortcut> */}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <SignOutDialog open={!!open} onOpenChange={setOpen} />
        </>
    )
}
