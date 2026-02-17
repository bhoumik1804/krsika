import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useOutwardBalanceLiftingRice } from './outward-balance-lifting-rice-provider'

export function OutwardBalanceLiftingRicePrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = useOutwardBalanceLiftingRice()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('outwardRiceSales.addRecord')}
        </Button>
    )
}
