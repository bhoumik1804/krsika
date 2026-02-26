import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { useBalanceLiftingPurchasesPaddy } from './balance-lifting-purchases-paddy-provider'

export function BalanceLiftingPurchasesPaddyPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = useBalanceLiftingPurchasesPaddy()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('balanceLifting.purchase.paddy.primaryButton')}
        </Button>
    )
}
