import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useInwards } from './inwards-provider'

export function InwardsPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = useInwards()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('inwards.addEntry')}
        </Button>
    )
}
