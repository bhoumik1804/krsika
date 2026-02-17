import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useFrkInward } from './frk-inward-provider'

export function FrkInwardPrimaryButtons() {
    const { setOpen } = useFrkInward()
    const { t } = useTranslation('mill-staff')

    return (
        <div className='flex gap-2'>
            <Button onClick={() => setOpen('add')} className='space-x-1'>
                <span>{t('frkInward.addRecord')}</span>
                <Plus size={18} />
            </Button>
        </div>
    )
}
