import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { labourOther } from './labour-other-provider'

export function LabourOtherPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = labourOther()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('labourOther.addRecord')}
        </Button>
    )
}
