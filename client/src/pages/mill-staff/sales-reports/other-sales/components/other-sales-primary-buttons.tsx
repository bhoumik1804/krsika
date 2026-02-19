import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useOtherSales } from './other-sales-provider'

export function OtherSalesPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen, setCurrentRow } = useOtherSales()

    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            {t('salesReports.other.form.primaryButton')}
        </Button>
    )
}
