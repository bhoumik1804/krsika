import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useDoReport } from './do-report-provider'

export function DoReportPrimaryButtons() {
    const { setOpen, setCurrentRow } = useDoReport()
    const { t } = useTranslation('mill-staff')

    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            {t('doReport.addRecord')}
        </Button>
    )
}
