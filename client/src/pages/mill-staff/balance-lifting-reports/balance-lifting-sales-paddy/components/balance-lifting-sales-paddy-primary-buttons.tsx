import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useBalanceLiftingSalesPaddy } from './balance-lifting-sales-paddy-provider'

export function BalanceLiftingSalesPaddyPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = useBalanceLiftingSalesPaddy()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('balanceLifting.sales.paddy.primaryButton')}
        </Button>
    )
}
