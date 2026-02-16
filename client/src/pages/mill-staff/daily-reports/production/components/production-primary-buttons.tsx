import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useProduction } from './production-provider'

export function ProductionPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = useProduction()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('production.addEntry')}
        </Button>
    )
}
