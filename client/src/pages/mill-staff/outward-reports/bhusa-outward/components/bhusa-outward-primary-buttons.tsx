import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { bhusaOutward } from './bhusa-outward-provider'

export function BhusaOutwardPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen, setCurrentRow } = bhusaOutward()

    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            {t('outward.bhusaOutward.form.primaryButton')}
        </Button>
    )
}
