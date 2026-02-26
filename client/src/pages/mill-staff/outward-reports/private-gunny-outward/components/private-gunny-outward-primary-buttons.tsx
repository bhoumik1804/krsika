import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { usePrivateGunnyOutward } from './private-gunny-outward-provider'

export function PrivateGunnyOutwardPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = usePrivateGunnyOutward()
    return (
        <div className='flex gap-2'>
            <Button onClick={() => setOpen('add')} className='space-x-1'>
                <span>
                    {t('outward.privateGunnyOutward.form.primaryButton')}
                </span>{' '}
                <Plus size={18} />
            </Button>
        </div>
    )
}
