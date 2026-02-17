import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useOtherInward } from './other-inward-provider'

export function OtherInwardPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = useOtherInward()
    return (
        <div className='flex gap-2'>
            <Button className='space-x-1' onClick={() => setOpen('add')}>
                <span>{t('otherInward.addRecord')}</span> <Plus size={18} />
            </Button>
        </div>
    )
}
