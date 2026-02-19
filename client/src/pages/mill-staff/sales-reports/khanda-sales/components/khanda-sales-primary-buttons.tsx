import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useKhandaSales } from './khanda-sales-provider'

export function KhandaSalesPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = useKhandaSales()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('salesReports.khanda.form.primaryButton')}
        </Button>
    )
}
