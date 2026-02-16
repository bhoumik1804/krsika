import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useStaffReport } from './staff-report-provider'

export function StaffReportPrimaryButtons() {
    const { setOpen, setCurrentRow } = useStaffReport()
    const { t } = useTranslation('mill-staff')

    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            {t('staffReport.addRecord')}
        </Button>
    )
}
