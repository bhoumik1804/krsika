import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePrivateGunnyOutward } from './private-gunny-outward-provider'

export function PrivateGunnyOutwardPrimaryButtons() {
    const { setOpen } = usePrivateGunnyOutward()
    return (
        <div className='flex gap-2'>
            <Button onClick={() => setOpen('add')} className='space-x-1'>
                <span>Add Record</span> <Plus size={18} />
            </Button>
        </div>
    )
}
