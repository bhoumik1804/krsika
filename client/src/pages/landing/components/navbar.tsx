import { useState } from 'react'
import { Menu, X, Wheat } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { ThemeSwitch } from '@/components/theme-switch'
import { navbarData } from '../data'

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

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
                        <Button variant='ghost' asChild>
                            <Link to='/sign-in'>Sign In</Link>
                        </Button>
                        <Button asChild>
                            <Link to='/sign-up'>Get Started</Link>
                        </Button>
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
                                <Button
                                    variant='ghost'
                                    asChild
                                    className='justify-start'
                                >
                                    <Link to='/sign-in'>Sign In</Link>
                                </Button>
                                <Button asChild>
                                    <Link to='/sign-up'>Get Started</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
