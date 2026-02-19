import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useBalanceLiftingPurchasesFrk } from './balance-lifting-purchases-frk-provider'

export function BalanceLiftingPurchasesFrkPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = useBalanceLiftingPurchasesFrk()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('balanceLifting.purchase.frk.primaryButton')}
        </Button>
    )
}
