import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LanguageIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { setLanguage, selectCurrentLanguage } from '@/store/slices/languageSlice';

export default function LanguageToggle() {
    const { i18n, t } = useTranslation('common');
    const dispatch = useDispatch();
    const currentLanguage = useSelector(selectCurrentLanguage);

    // Sync i18n with Redux state on mount and when language changes
    useEffect(() => {
        if (i18n.language !== currentLanguage) {
            i18n.changeLanguage(currentLanguage);
        }
    }, [currentLanguage, i18n]);

    const changeLanguage = (lng) => {
        dispatch(setLanguage(lng));
        i18n.changeLanguage(lng);
    };

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
                        {t('languages.english')}
                    </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => changeLanguage('hi')}
                    className={currentLanguage === 'hi' ? 'bg-accent' : ''}
                >
                    <span className="flex items-center gap-2">
                        {currentLanguage === 'hi' && <span>✓</span>}
                        {t('languages.hindi')}
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
