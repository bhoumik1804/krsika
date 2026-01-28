import { Wheat } from 'lucide-react'
import { Link } from 'react-router'
import { footerData } from '../data'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className='border-t border-border bg-card'>
            <div className='container mx-auto px-4 py-16 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6 lg:gap-12'>
                    {/* Brand */}
                    <div className='lg:col-span-2'>
                        <Link to='/' className='mb-4 flex items-center gap-2'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary'>
                                <Wheat className='h-6 w-6 text-primary-foreground' />
                            </div>
                            <span className='text-xl font-bold text-foreground'>
                                Rice Mill{' '}
                                <span className='text-primary'>SaaS</span>
                            </span>
                        </Link>
                        <p className='mb-6 max-w-xs text-sm text-muted-foreground'>
                            {footerData.brandDescription}
                        </p>
                        {/* Social Links */}
                        <div className='flex items-center gap-4'>
                            {footerData.socialLinks.map((social) => {
                                const Icon = social.icon
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground'
                                        aria-label={social.label}
                                    >
                                        <Icon className='h-4 w-4' />
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className='mb-4 font-semibold text-foreground'>
                            Product
                        </h4>
                        <ul className='space-y-3'>
                            {footerData.footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className='mb-4 font-semibold text-foreground'>
                            Company
                        </h4>
                        <ul className='space-y-3'>
                            {footerData.footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className='mb-4 font-semibold text-foreground'>
                            Resources
                        </h4>
                        <ul className='space-y-3'>
                            {footerData.footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className='mb-4 font-semibold text-foreground'>
                            Legal
                        </h4>
                        <ul className='space-y-3'>
                            {footerData.footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className='mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row'>
                    <p className='text-sm text-muted-foreground'>
                        © {currentYear} Rice Mill SaaS. All rights reserved.
                    </p>
                    <p className='text-sm text-muted-foreground'>
                        Made with ❤️ in India
                    </p>
                </div>
            </div>
        </footer>
    )
}
