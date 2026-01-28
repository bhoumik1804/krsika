import { MillAdminSettings } from '..'
import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'

export function MillAdminProfile() {
    return (
        <MillAdminSettings>
            <ContentSection
                title='Profile'
                desc='This is how others will see you on the site.'
            >
                <ProfileForm />
            </ContentSection>
        </MillAdminSettings>
    )
}
