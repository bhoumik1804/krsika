import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Outlet } from 'react-router'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'

export function RootLayout() {
    useDocumentTitle()

    return (
        <>
            <NavigationProgress />
            <Outlet />
            <Toaster duration={5000} />
            {import.meta.env.MODE === 'development' && (
                <ReactQueryDevtools buttonPosition='bottom-left' />
            )}
        </>
    )
}
