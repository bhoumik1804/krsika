import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOtherInward } from './other-inward-provider'

export function OtherInwardPrimaryButtons() {
    const { setOpen } = useOtherInward()
    return (
        <div className='flex gap-2'>
            <Button className='space-x-1' onClick={() => setOpen('add')}>
                <span>Add Record</span> <Plus size={18} />
            </Button>
        </div>
    )
}
