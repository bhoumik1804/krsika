import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useFrkInward } from './frk-inward-provider'

export function FrkInwardPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = useFrkInward()
    return (
        <div className='flex gap-2'>
            <Button onClick={() => setOpen('add')} className='space-x-1'>
                <span>{t('inward.frkInward.form.primaryButton')}</span>
                <Plus size={18} />
            </Button>
        </div>
    )
}
