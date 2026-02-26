import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { usePaddy } from './paddy-provider'

export function PaddyPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = usePaddy()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('purchaseReports.paddy.form.primaryButton')}
        </Button>
    )
}
