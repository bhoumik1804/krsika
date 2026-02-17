import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useBalanceLiftingPurchasesRice } from './balance-lifting-purchases-rice-provider'

export function BalanceLiftingPurchasesRicePrimaryButtons() {
    const { setOpen } = useBalanceLiftingPurchasesRice()
    const { t } = useTranslation()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('ricePurchase.addPurchase')}
        </Button>
    )
}
