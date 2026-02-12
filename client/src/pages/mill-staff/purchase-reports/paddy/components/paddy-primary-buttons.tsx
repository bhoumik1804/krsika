import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePaddy } from './paddy-provider'
import { usePermission } from '@/hooks/use-permission'

export function PaddyPrimaryButtons() {
    const { setOpen } = usePaddy()
    const { can } = usePermission()

    if (!can('paddy-purchase-report', 'create')) {
        return null
    }

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Purchase
        </Button>
    )
}
