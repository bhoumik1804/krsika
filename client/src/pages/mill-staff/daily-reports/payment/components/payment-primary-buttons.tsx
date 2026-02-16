import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { usePayment } from './payment-provider'

export function PaymentPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = usePayment()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('dailyReports.payment.primaryButton')}
        </Button>
    )
}
