import { useTranslation } from 'react-i18next'
import { MillStaffSettings } from '../'
import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'

export function MillStaffProfile() {
    const { t } = useTranslation()
    return (
        <MillStaffSettings>
            <ContentSection
                title={t('settings.profile')}
                desc={t('settings.profileDesc')}
            >
                <ProfileForm />
            </ContentSection>
        </MillStaffSettings>
    )
}
