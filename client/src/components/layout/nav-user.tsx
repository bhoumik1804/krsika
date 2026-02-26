import { ChevronsUpDown, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useAuthStore } from '@/stores/auth-store'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { type NavItem } from './types'

type NavUserProps = {
    user: {
        name: string
        email: string
        avatar: string
        role?: string
    }
    links?: NavItem[]
}

export function NavUser({ user, links }: NavUserProps) {
    const { isMobile } = useSidebar()
    const { t } = useTranslation('mill-staff')
    const storeUser = useAuthStore((state) => state.user)
    const [open, setOpen] = useDialogState()
    const isMillStaff = user.role === 'mill-staff'

    const getLabel = (label: string) => (isMillStaff ? t(label) : label)
    const displayName = storeUser?.fullName || user.name
    const displayEmail = storeUser?.email || user.email

    const initials = displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size='lg'
                                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                            >
                                <Avatar className='h-8 w-8 rounded-lg'>
                                    <AvatarImage
                                        src={user.avatar}
                                        alt={displayName}
                                    />
                                    <AvatarFallback className='rounded-lg'>
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='grid flex-1 text-start text-sm leading-tight'>
                                    <span className='truncate font-semibold'>
                                        {displayName}
                                    </span>
                                    <span className='truncate text-xs'>
                                        {displayEmail}
                                    </span>
                                </div>
                                <ChevronsUpDown className='ms-auto size-4' />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                            side={isMobile ? 'bottom' : 'right'}
                            align='end'
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className='p-0 font-normal'>
                                <div className='flex items-center gap-2 px-1 py-1.5 text-start text-sm'>
                                    <Avatar className='h-8 w-8 rounded-lg'>
                                        <AvatarImage
                                            src={user.avatar}
                                            alt={displayName}
                                        />
                                        <AvatarFallback className='rounded-lg'>
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='grid flex-1 text-start text-sm leading-tight'>
                                        <span className='truncate font-semibold'>
                                            {displayName}
                                        </span>
                                        <span className='truncate text-xs'>
                                            {displayEmail}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            {/* <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Sparkles />
                                    Upgrade to Pro
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator /> */}
                            <DropdownMenuGroup>
                                {links?.map((link) => (
                                    <DropdownMenuItem key={link.title} asChild>
                                        <Link to={link.url || '#'}>
                                            {link.icon && <link.icon />}
                                            {getLabel(link.title)}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant='destructive'
                                onClick={() => setOpen(true)}
                            >
                                <LogOut />
                                {isMillStaff
                                    ? t('sidebar.signOut')
                                    : 'Sign out'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

            <SignOutDialog open={!!open} onOpenChange={setOpen} />
        </>
    )
}
