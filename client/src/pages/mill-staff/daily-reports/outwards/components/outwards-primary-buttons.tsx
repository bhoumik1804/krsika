import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useOutwards } from './outwards-provider'

export function OutwardsPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = useOutwards()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('outwards.addEntry')}
        </Button>
    )
}
