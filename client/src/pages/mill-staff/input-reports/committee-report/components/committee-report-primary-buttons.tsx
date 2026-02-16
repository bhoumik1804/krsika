import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useCommitteeReport } from './committee-report-provider'

export function CommitteeReportPrimaryButtons() {
    const { setOpen, setCurrentRow } = useCommitteeReport()
    const { t } = useTranslation('mill-staff')

    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            {t('inputReports.committeeReport.addRecord')}
        </Button>
    )
}
