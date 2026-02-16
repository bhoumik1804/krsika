import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBalanceLiftingPurchasesGunny } from './balance-lifting-purchases-gunny-provider'
import { useTranslation } from 'react-i18next'

export function BalanceLiftingPurchasesGunnyPrimaryButtons() {
    const { setOpen } = useBalanceLiftingPurchasesGunny()
    const { t } = useTranslation()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('balanceLiftingGunnyPurchase.addPurchase')}
        </Button>
    )
}
