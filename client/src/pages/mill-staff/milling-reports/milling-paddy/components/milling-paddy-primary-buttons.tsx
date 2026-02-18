import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { millingPaddy } from './milling-paddy-provider'

export function MillingPaddyPrimaryButtons() {
    const { setOpen } = millingPaddy()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
