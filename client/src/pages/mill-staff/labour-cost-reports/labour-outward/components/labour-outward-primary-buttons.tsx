import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { labourOutward } from './labour-outward-provider'

export function LabourOutwardPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = labourOutward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('labourCostReports.outward.form.primaryButton')}
        </Button>
    )
}
