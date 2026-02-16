import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { usePartyReport } from './party-report-provider'

export function PartyReportPrimaryButtons() {
    const { setOpen, setCurrentRow } = usePartyReport()
    const { t } = useTranslation('mill-staff')

    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            {t('partyReport.form.addTitle')}
        </Button>
    )
}
