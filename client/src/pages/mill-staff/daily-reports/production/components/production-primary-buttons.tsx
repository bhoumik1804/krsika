import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProduction } from './production-provider'

export function ProductionPrimaryButtons() {
    const { setOpen } = useProduction()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Entry
        </Button>
    )
}
