import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBalanceLiftingPurchasesRice } from './balance-lifting-purchases-rice-provider'
import { useTranslation } from 'react-i18next'

export function BalanceLiftingPurchasesRicePrimaryButtons() {
    const { setOpen } = useBalanceLiftingPurchasesRice()
    const { t } = useTranslation()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('balanceLiftingRicePurchase.addPurchase')}
        </Button>
    )
}
