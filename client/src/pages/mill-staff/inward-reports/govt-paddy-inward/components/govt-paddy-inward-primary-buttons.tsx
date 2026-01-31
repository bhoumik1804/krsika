import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { govtPaddyInward } from './govt-paddy-inward-provider'

export function GovtPaddyInwardPrimaryButtons() {
    const { setOpen } = govtPaddyInward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
