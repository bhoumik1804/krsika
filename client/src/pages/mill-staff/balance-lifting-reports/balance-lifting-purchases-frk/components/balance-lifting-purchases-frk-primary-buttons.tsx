import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBalanceLiftingPurchasesFrk } from './balance-lifting-purchases-frk-provider'
import { useTranslation } from 'react-i18next'

export function BalanceLiftingPurchasesFrkPrimaryButtons() {
    const { setOpen } = useBalanceLiftingPurchasesFrk()
    const { t } = useTranslation()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('balanceLiftingFrkPurchase.addPurchase')}
        </Button>
    )
}
