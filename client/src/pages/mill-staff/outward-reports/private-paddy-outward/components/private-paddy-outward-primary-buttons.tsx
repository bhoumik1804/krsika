import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { usePrivatePaddyOutward } from './private-paddy-outward-provider'

export function PrivatePaddyOutwardPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = usePrivatePaddyOutward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('privatePaddyOutward.addRecord')}
        </Button>
    )
}
