import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { millingRice } from './milling-rice-provider'

export function MillingRicePrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = millingRice()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('millingRice.addRecord')}
        </Button>
    )
}
