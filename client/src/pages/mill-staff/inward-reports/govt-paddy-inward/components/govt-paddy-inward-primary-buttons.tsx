import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useGovtPaddyInward } from './govt-paddy-inward-provider'

export function GovtPaddyInwardPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen, setCurrentRow } = useGovtPaddyInward()

    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            {t('inward.govtPaddyInward.form.primaryButton')}
        </Button>
    )
}
