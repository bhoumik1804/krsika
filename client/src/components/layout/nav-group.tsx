import { type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { LongText } from '../long-text'
import { Badge } from '../ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
    type NavCollapsible,
    type NavItem,
    type NavLink,
    type NavGroup as NavGroupProps,
} from './types'

import { usePermission } from '@/hooks/use-permission'

import { useTranslation } from 'react-i18next'

export function NavGroup({ title, items }: NavGroupProps) {
    const { state, isMobile } = useSidebar()
    const { can } = usePermission()
    const { t } = useTranslation()
    const location = useLocation()
    const href = location.pathname

    // Filter items based on permissions
    const visibleItems = items.filter((item) => {
        // If it's a collapsible with sub-items, check if any sub-item is visible
        if (item.items) {
            const hasVisibleSubItems = item.items.some((subItem) =>
                can(subItem.moduleSlug, 'view')
            )
            return hasVisibleSubItems
        }
        // Otherwise check the item itself
        return can(item.moduleSlug, 'view')
    })

    // If no items are visible, don't render the group
    if (visibleItems.length === 0) return null

    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                <LongText
                    className='max-w-40 text-sm'
                    contentClassName='truncate'
                >
                    {t(title)}
                </LongText>
            </SidebarGroupLabel>
            <SidebarMenu>
                {visibleItems.map((item) => {
                    const key = `${item.title}-${item.url}`

                    if (!item.items)
                        return (
                            <SidebarMenuLink
                                key={key}
                                item={item}
                                href={href}
                            />
                        )

                    if (state === 'collapsed' && !isMobile)
                        return (
                            <SidebarMenuCollapsedDropdown
                                key={key}
                                item={item}
                                href={href}
                            />
                        )

                    return (
                        <SidebarMenuCollapsible
                            key={key}
                            item={item}
                            href={href}
                        />
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}

function NavBadge({ children }: { children: ReactNode }) {
    return <Badge className='rounded-full px-1 py-0 text-xs'>{children}</Badge>
}

function SidebarMenuLink({ item, href }: { item: NavLink; href: string }) {
    const { setOpenMobile } = useSidebar()
    const { t } = useTranslation()
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={checkIsActive(href, item)}
                tooltip={item.title}
            >
                <Link to={item.url} onClick={() => setOpenMobile(false)}>
                    {item.icon && <item.icon />}
                    <LongText className='max-w-40' contentClassName='truncate'>
                        {t(item.title)}
                    </LongText>
                    {item.badge && <NavBadge>{item.badge}</NavBadge>}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

function SidebarMenuCollapsible({
    item,
    href,
}: {
    item: NavCollapsible
    href: string
}) {
    const { setOpenMobile } = useSidebar()
    const { can } = usePermission()
    const { t } = useTranslation()
    return (
        <Collapsible
            asChild
            defaultOpen={checkIsActive(href, item, true)}
            className='group/collapsible'
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <LongText
                            className='max-w-36'
                            contentClassName='truncate'
                        >
                            {t(item.title)}
                        </LongText>
                        {item.badge && <NavBadge>{item.badge}</NavBadge>}
                        <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180' />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className='CollapsibleContent'>
                    <SidebarMenuSub>
                        {item.items
                            .filter((subItem) =>
                                can(subItem.moduleSlug, 'view')
                            )
                            .map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                        asChild
                                        isActive={checkIsActive(href, subItem)}
                                    >
                                        <Link
                                            to={subItem.url}
                                            onClick={() => setOpenMobile(false)}
                                        >
                                            {subItem.icon && <subItem.icon />}
                                            <LongText
                                                className='max-w-40'
                                                contentClassName='truncate'
                                            >
                                                {t(subItem.title)}
                                            </LongText>
                                            {subItem.badge && (
                                                <NavBadge>
                                                    {subItem.badge}
                                                </NavBadge>
                                            )}
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}

function SidebarMenuCollapsedDropdown({
    item,
    href,
}: {
    item: NavCollapsible
    href: string
}) {
    const { can } = usePermission()
    const { t } = useTranslation()
    return (
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                        tooltip={item.title}
                        isActive={checkIsActive(href, item)}
                    >
                        {item.icon && <item.icon />}
                        <LongText
                            className='max-w-40'
                            contentClassName='truncate'
                        >
                            {t(item.title)}
                        </LongText>
                        {item.badge && <NavBadge>{item.badge}</NavBadge>}
                        <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side='right' align='start' sideOffset={4}>
                    <DropdownMenuLabel>
                        {t(item.title)} {item.badge ? `(${item.badge})` : ''}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {item.items
                        .filter((sub) => can(sub.moduleSlug, 'view'))
                        .map((sub) => (
                            <DropdownMenuItem
                                key={`${sub.title}-${sub.url}`}
                                asChild
                            >
                                <Link
                                    to={sub.url}
                                    className={`${checkIsActive(href, sub) ? 'bg-secondary' : ''}`}
                                >
                                    {sub.icon && <sub.icon />}
                                    <LongText
                                        className='max-w-48'
                                        contentClassName='truncate'
                                    >
                                        {t(sub.title)}
                                    </LongText>
                                    {sub.badge && (
                                        <span className='ms-auto text-xs'>
                                            {sub.badge}
                                        </span>
                                    )}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    )
}

function checkIsActive(href: string, item: NavItem, mainNav = false) {
    const itemUrl =
        typeof item.url === 'string' ? item.url : String(item.url || '')
    return (
        href === itemUrl || // /endpint?search=param
        href.split('?')[0] === itemUrl || // endpoint
        !!item?.items?.filter((i) => {
            const subUrl =
                typeof i.url === 'string' ? i.url : String(i.url || '')
            return subUrl === href
        }).length || // if child nav is active
        (mainNav &&
            href.split('/')[1] !== '' &&
            href.split('/')[1] === itemUrl?.split('/')[1])
    )
}
