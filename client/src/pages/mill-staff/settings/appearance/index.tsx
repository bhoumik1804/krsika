import { MillStaffSettings } from '../'
import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export function MillStaffAppearance() {
    return (
        <MillStaffSettings>
            <ContentSection
                title='Appearance'
                desc='Customize the appearance of the app. Automatically switch between day and night themes.'
            >
                <AppearanceForm />
            </ContentSection>
        </MillStaffSettings>
    )
}
