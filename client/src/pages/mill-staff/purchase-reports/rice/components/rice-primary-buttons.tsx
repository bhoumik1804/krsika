import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useRice } from './rice-provider'

export function RicePrimaryButtons() {
    const { t } = useTranslation('millStaff')
    const { setOpen, setCurrentRow } = useRice()

    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            {t('ricePurchase.form.addTitle')}
        </Button>
    )
}
