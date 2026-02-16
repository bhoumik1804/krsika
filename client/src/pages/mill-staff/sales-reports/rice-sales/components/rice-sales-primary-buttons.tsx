import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useRiceSales } from './rice-sales-provider'

export function RiceSalesPrimaryButtons() {
    const { t } = useTranslation('millStaff')
    const { setOpen } = useRiceSales()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 h-4 w-4' />
            {t('riceSales.form.buttons.add')}
        </Button>
    )
}
