import { Settings } from '..'
import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export function SettingsAppearance() {
    return (
        <Settings>
            <ContentSection
                title='Appearance'
                desc='Customize the appearance of the app. Automatically switch between day
          and night themes.'
            >
                <AppearanceForm />
            </ContentSection>
        </Settings>
    )
}
