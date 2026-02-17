import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useGovtGunnyOutward } from './govt-gunny-outward-provider'

export function GovtGunnyOutwardPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = useGovtGunnyOutward()
    return (
        <div className='flex gap-2'>
            <Button onClick={() => setOpen('add')} className='space-x-1'>
                <span>{t('govtGunnyOutward.addRecord')}</span>{' '}
                <Plus size={18} />
            </Button>
        </div>
    )
}
