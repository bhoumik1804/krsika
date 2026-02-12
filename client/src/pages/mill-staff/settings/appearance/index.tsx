import { useTranslation } from 'react-i18next'
import { MillStaffSettings } from '../'
import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export function MillStaffAppearance() {
    const { t } = useTranslation()
    return (
        <MillStaffSettings>
            <ContentSection
                title={t('settings.appearance')}
                desc={t(
                    'settings.appearanceDesc',
                    'Customize the appearance of the app. Automatically switch between day and night themes.'
                )}
            >
                <AppearanceForm />
            </ContentSection>
        </MillStaffSettings>
    )
}
