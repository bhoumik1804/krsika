import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { changeLanguage, getCurrentLanguage } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const languages = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
] as const

export function LanguageSwitch() {
    const { t } = useTranslation()
    const currentLang = getCurrentLanguage()

    const handleLanguageChange = (langCode: 'en' | 'hi') => {
        changeLanguage(langCode)
        // Force re-render by reloading - or you can use state/context
        window.location.reload()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    size='icon'
                    className='scale-95 rounded-full'
                >
                    <Globe className='size-[1.2rem]' />
                    <span className='sr-only'>
                        {t('settings.selectLanguage')}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={currentLang === lang.code ? 'bg-accent' : ''}
                    >
                        <span className='mr-2'>{lang.nativeLabel}</span>
                        <span className='text-xs text-muted-foreground'>
                            ({lang.label})
                        </span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
