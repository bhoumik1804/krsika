import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useGunnySales } from './gunny-sales-provider'

export function GunnySalesPrimaryButtons() {
    const { t } = useTranslation('millStaff')
    const { setOpen } = useGunnySales()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('common.add')}
        </Button>
    )
}
