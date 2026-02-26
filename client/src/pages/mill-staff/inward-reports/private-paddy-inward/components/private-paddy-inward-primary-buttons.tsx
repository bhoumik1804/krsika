import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { privatePaddyInward } from './private-paddy-inward-provider'

export function PrivatePaddyInwardPrimaryButtons() {
    const { t } = useTranslation('mill-staff')
    const { setOpen } = privatePaddyInward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            {t('inward.privatePaddyInward.form.primaryButton')}
        </Button>
    )
}
