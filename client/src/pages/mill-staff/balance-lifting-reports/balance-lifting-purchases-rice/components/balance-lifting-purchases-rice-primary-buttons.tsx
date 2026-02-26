import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { useBalanceLiftingPurchasesRice } from './balance-lifting-purchases-rice-provider'

export function BalanceLiftingPurchasesRicePrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = useBalanceLiftingPurchasesRice()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('balanceLifting.purchase.rice.primaryButton')}
        </Button>
    )
}
