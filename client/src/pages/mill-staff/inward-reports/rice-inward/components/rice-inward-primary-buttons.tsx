import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { riceInward } from './rice-inward-provider'

export function RiceInwardPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = riceInward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('inward.riceInward.form.primaryButton')}
        </Button>
    )
}
