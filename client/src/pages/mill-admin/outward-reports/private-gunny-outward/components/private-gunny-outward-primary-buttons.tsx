import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePrivateGunnyOutwardContext } from './private-gunny-outward-provider'

export function PrivateGunnyOutwardPrimaryButtons() {
    const { setOpen } = usePrivateGunnyOutwardContext()
    return (
        <div className='flex gap-2'>
            <Button onClick={() => setOpen('add')} className='space-x-1'>
                <span>Add Record</span> <Plus size={18} />
            </Button>
        </div>
    )
}
