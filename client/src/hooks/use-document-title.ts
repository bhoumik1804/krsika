import { useEffect } from 'react'
import { useLocation } from 'react-router'

export function useDocumentTitle() {
    const location = useLocation()

    useEffect(() => {
        const pathname = location.pathname

        let title = 'Krsika'

        if (pathname.startsWith('/admin')) {
            title = 'Super Admin'
        } else if (pathname.startsWith('/staff')) {
            title = 'Staff Dashboard'
        } else if (pathname.startsWith('/mill')) {
            title = 'Mill Admin Dashboard'
        }

        document.title = title
    }, [location.pathname])
}
