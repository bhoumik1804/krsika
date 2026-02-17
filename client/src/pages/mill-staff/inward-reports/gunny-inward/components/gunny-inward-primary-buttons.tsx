import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { gunnyInward } from './gunny-inward-provider'

export function GunnyInwardPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen, setCurrentRow } = gunnyInward()

    const handleAdd = () => {
        setCurrentRow(null)
        setOpen('add')
    }

    return (
        <Button onClick={handleAdd}>
            <Plus className='mr-2 size-4' />
            {t('gunnyInward.addRecord')}
        </Button>
    )
}
