import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useReceipt } from './receipt-provider'

export function ReceiptPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = useReceipt()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('dailyReports.receipt.primaryButton')}
        </Button>
    )
}
