import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useGunny } from './gunny-provider'

export function GunnyPrimaryButtons() {
    const { t } = useTranslation('millStaff')
    const { setOpen, setCurrentRow } = useGunny()

    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            {t('gunnyPurchase.form.addTitle')}
        </Button>
    )
}
