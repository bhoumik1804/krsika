import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { useBalanceLiftingPurchasesGunny } from './balance-lifting-purchases-gunny-provider'

export function BalanceLiftingPurchasesGunnyPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = useBalanceLiftingPurchasesGunny()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('balanceLifting.purchase.gunny.primaryButton')}
        </Button>
    )
}
