import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LanguageToggle() {
    const { i18n, t } = useTranslation('common');

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const currentLanguage = i18n.language || 'en';
    const languageLabel = currentLanguage === 'hi' ? 'हिंदी' : 'EN';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <LanguageIcon className="h-4 w-4" />
                    <span className="font-medium">{languageLabel}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="space-y-1 p-1">
                <DropdownMenuItem
                    onClick={() => changeLanguage('en')}
                    className={currentLanguage === 'en' ? 'bg-accent' : ''}
                >
                    <span className="flex items-center gap-2">
                        {currentLanguage === 'en' && <span>✓</span>}
                        {t('language.english')}
                    </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => changeLanguage('hi')}
                    className={currentLanguage === 'hi' ? 'bg-accent' : ''}
                >
                    <span className="flex items-center gap-2">
                        {currentLanguage === 'hi' && <span>✓</span>}
                        {t('language.hindi')}
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
