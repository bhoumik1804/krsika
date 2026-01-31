import { useState } from 'react'
import { User, USER_ROLES, UserRole } from '@/types'
import { Menu, X, Wheat } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeSwitch } from '@/components/theme-switch'
import { navbarData } from '../data'
import { useUser, useLogout } from '../hooks'

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navigate = useNavigate()

    // React Query hook for user data
    const { user, isLoading, isAuthenticated } = useUser({
        enabled: true,
        refetchOnWindowFocus: false, // Don't refetch on landing page
        retry: false, // Don't retry on landing page
    })

    // Logout mutation
    const { logout } = useLogout()

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                navigate('/')
            },
        })
    }

    const handleGoToDashboard = () => {
        if (user) {
            const path = getDashboardPath(user)
            navigate(path)
        }
    }

    const getInitials = (fullName: string) => {
        return fullName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <nav className='fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/80 backdrop-blur-md'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 items-center justify-between'>
                    {/* Logo */}
                    <Link to='/' className='flex items-center gap-2'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary'>
                            <Wheat className='h-6 w-6 text-primary-foreground' />
                        </div>
                        <span className='text-xl font-bold text-foreground'>
                            Rice Mill <span className='text-primary'>SaaS</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className='hidden items-center gap-8 md:flex'>
                        {navbarData.navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className='font-medium text-muted-foreground transition-colors hover:text-foreground'
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTA Buttons */}
                    <div className='hidden items-center gap-4 md:flex'>
                        {!isAuthenticated && !isLoading && (
                            <>
                                <Button variant='ghost' asChild>
                                    <Link to='/sign-in'>Sign In</Link>
                                </Button>
                                <Button asChild>
                                    <Link to='/sign-up'>Get Started</Link>
                                </Button>
                            </>
                        )}

                        {isAuthenticated && user && (
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant='ghost'
                                            className='relative h-10 w-10 rounded-full'
                                        >
                                            <Avatar className='h-10 w-10'>
                                                <AvatarImage
                                                    src={user.avatar}
                                                    alt={user.fullName}
                                                />
                                                <AvatarFallback>
                                                    {getInitials(user.fullName)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className='w-56'
                                        align='end'
                                    >
                                        <DropdownMenuLabel>
                                            <div className='flex flex-col space-y-1'>
                                                <p className='text-sm leading-none font-medium'>
                                                    {user.fullName}
                                                </p>
                                                <p className='text-xs leading-none text-muted-foreground'>
                                                    {user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleGoToDashboard}
                                        >
                                            Dashboard
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link to='/settings/profile'>
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className='text-destructive'
                                        >
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )}

                        <div className='ml-2 hidden border-l border-border pl-4 md:block'>
                            <ThemeSwitch />
                        </div>
                    </div>

                    <div className='flex items-center gap-2 md:hidden'>
                        <ThemeSwitch />
                        <button
                            className='p-2 text-muted-foreground hover:text-foreground'
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label='Toggle menu'
                        >
                            {isMenuOpen ? (
                                <X className='h-6 w-6' />
                            ) : (
                                <Menu className='h-6 w-6' />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className='border-t border-border py-4 md:hidden'>
                        <div className='flex flex-col gap-4'>
                            {navbarData.navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className='px-2 font-medium text-muted-foreground transition-colors hover:text-foreground'
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}

                            <div className='flex flex-col gap-2 border-t border-border pt-4'>
                                {!isAuthenticated && !isLoading && (
                                    <>
                                        <Button
                                            variant='ghost'
                                            asChild
                                            className='justify-start'
                                        >
                                            <Link to='/sign-in'>Sign In</Link>
                                        </Button>
                                        <Button asChild>
                                            <Link to='/sign-up'>
                                                Get Started
                                            </Link>
                                        </Button>
                                    </>
                                )}

                                {isAuthenticated && user && (
                                    <>
                                        <div className='flex items-center gap-3 px-2 pb-2'>
                                            <Avatar className='h-10 w-10'>
                                                <AvatarImage
                                                    src={user.avatar}
                                                    alt={user.fullName}
                                                />
                                                <AvatarFallback>
                                                    {getInitials(user.fullName)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className='flex flex-col'>
                                                <p className='text-sm font-medium'>
                                                    {user.fullName}
                                                </p>
                                                <p className='text-xs text-muted-foreground'>
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant='outline'
                                            onClick={() => {
                                                handleGoToDashboard()
                                                setIsMenuOpen(false)
                                            }}
                                        >
                                            Go to Dashboard
                                        </Button>
                                        <Button
                                            variant='ghost'
                                            onClick={() => {
                                                handleLogout()
                                                setIsMenuOpen(false)
                                            }}
                                            className='justify-start text-destructive'
                                        >
                                            Log out
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

/**
 * Get dashboard path based on user role
 */

// Each role maps to a function that receives `user` and returns a path
const ROLE_REDIRECT_MAP: Record<UserRole, (user: User) => string> = {
    [USER_ROLES.SUPER_ADMIN]: () => '/admin',
    [USER_ROLES.MILL_ADMIN]: (user) => `/mill/${user.millId}`,
    [USER_ROLES.MILL_STAFF]: (user) => `/staff/${user.millId}`,
    [USER_ROLES.GUEST_USER]: () => '/',
}

// Function to get dashboard path
export function getDashboardPath(user: User): string {
    return ROLE_REDIRECT_MAP[user.role]?.(user) ?? '/'
}
