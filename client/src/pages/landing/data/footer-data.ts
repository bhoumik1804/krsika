import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react'

export const footerData = {
    brandDescription:
        'The complete cloud platform for modern rice mill operations. Trusted by 500+ mills across India.',
    footerLinks: {
        product: [
            { label: 'Features', href: '#features' },
            { label: 'Demo', href: '#demo' },
            { label: 'Changelog', href: '/changelog' },
            { label: 'Roadmap', href: '/roadmap' },
        ],
        company: [
            { label: 'About Us', href: '/about' },
            { label: 'Careers', href: '/careers' },
            { label: 'Press', href: '/press' },
            { label: 'Partners', href: '/partners' },
            { label: 'Contact', href: '/contact' },
        ],
        resources: [
            { label: 'Help Center', href: '/help' },
            { label: 'Blog', href: '/blog' },
            { label: 'Documentation', href: '/docs' },
            { label: 'API Reference', href: '/api' },
            { label: 'Status', href: '/status' },
        ],
        legal: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Cookie Policy', href: '/cookies' },
            { label: 'Refund Policy', href: '/refund' },
        ],
    },
    socialLinks: [
        { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
        { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
        { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
        { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
        { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    ],
}
