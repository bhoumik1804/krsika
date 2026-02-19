import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { silkyKodhaOutward } from './silky-kodha-outward-provider'

export function SilkyKodhaOutwardPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen, setCurrentRow } = silkyKodhaOutward()
    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            {t('outward.silkyKodhaOutward.form.primaryButton')}
        </Button>
    )
}
