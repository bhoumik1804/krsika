import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { millingPaddy } from './milling-paddy-provider'

export function MillingPaddyPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = millingPaddy()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('millingPaddy.addRecord')}
        </Button>
    )
}
