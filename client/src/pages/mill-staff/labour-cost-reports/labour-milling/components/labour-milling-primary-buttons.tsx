import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { labourMilling } from './labour-milling-provider'

export function LabourMillingPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = labourMilling()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('labourCostReports.milling.form.primaryButton')}
        </Button>
    )
}
