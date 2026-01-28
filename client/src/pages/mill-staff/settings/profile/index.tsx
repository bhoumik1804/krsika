import { MillStaffSettings } from '../'
import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'

export function MillStaffProfile() {
    return (
        <MillStaffSettings>
            <ContentSection
                title='Profile'
                desc='This is how others will see you on the site.'
            >
                <ProfileForm />
            </ContentSection>
        </MillStaffSettings>
    )
}
