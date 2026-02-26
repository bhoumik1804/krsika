import { UserPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useStaff } from './staff-provider'

export function StaffPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = useStaff()
    return (
        <div className='flex gap-2'>
            <Button className='space-x-1' onClick={() => setOpen('add')}>
                <span>{t('staff.addStaff')}</span> <UserPlus size={18} />
            </Button>
        </div>
    )
}
