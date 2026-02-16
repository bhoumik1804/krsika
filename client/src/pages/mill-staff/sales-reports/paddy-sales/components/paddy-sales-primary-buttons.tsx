import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { usePaddySales } from './paddy-sales-provider'

export function PaddySalesPrimaryButtons() {
    const { setOpen, setCurrentRow } = usePaddySales()
    const { t } = useTranslation('mill-staff')

    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            {t('common.addRecord', 'Add Record')}
        </Button>
    )
}
