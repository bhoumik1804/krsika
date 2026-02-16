import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBalanceLiftingPurchasesPaddy } from './balance-lifting-purchases-paddy-provider'
import { useTranslation } from 'react-i18next'

export function BalanceLiftingPurchasesPaddyPrimaryButtons() {
    const { setOpen } = useBalanceLiftingPurchasesPaddy()
    const { t } = useTranslation()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('balanceLiftingPaddyPurchase.addPurchase')}
        </Button>
    )
}
