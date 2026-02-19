import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { labourInward } from './labour-inward-provider'

export function LabourInwardPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = labourInward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('labourCostReports.inward.form.primaryButton')}
        </Button>
    )
}
