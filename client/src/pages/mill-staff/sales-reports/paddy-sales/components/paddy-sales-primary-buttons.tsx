import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { usePaddySales } from './paddy-sales-provider'

export function PaddySalesPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen, setCurrentRow } = usePaddySales()

    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            {t('salesReports.paddy.form.primaryButton')}
        </Button>
    )
}
