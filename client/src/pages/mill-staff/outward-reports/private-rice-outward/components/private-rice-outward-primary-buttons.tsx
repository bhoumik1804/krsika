import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { usePrivateRiceOutward } from './private-rice-outward-provider'

export function PrivateRiceOutwardPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = usePrivateRiceOutward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('privateRiceOutward.addRecord')}
        </Button>
    )
}
