import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useTransporterReport } from './transporter-report-provider'

export function TransporterReportPrimaryButtons() {
    const { setOpen, setCurrentRow } = useTransporterReport()
    const { t } = useTranslation('mill-staff')

    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            {t('inputReports.transporterReport.form.addTitle')}
        </Button>
    )
}
