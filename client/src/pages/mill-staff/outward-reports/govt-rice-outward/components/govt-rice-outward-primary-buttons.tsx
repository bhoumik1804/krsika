import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useGovtRiceOutward } from './govt-rice-outward-provider'

export function GovtRiceOutwardPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = useGovtRiceOutward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('outward.govtRiceOutward.form.primaryButton')}
        </Button>
    )
}
