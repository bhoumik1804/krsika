import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useGovtPaddyInward } from './govt-paddy-inward-provider'

export function GovtPaddyInwardPrimaryButtons() {
    const { setOpen } = useGovtPaddyInward()
    const { t } = useTranslation('mill-staff')

    return (
        <div className='flex gap-2'>
            <Button onClick={() => setOpen('add')} className='space-x-1'>
                <span>{t('govtPaddyInward.addRecord')}</span>
                <Plus size={18} />
            </Button>
        </div>
    )
}
