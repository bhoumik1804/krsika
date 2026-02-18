import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFrkInward } from './frk-inward-provider'

export function FrkInwardPrimaryButtons() {
    const { setOpen } = useFrkInward()
    return (
        <div className='flex gap-2'>
            <Button onClick={() => setOpen('add')} className='space-x-1'>
                <span>Add Record</span>
                <Plus size={18} />
            </Button>
        </div>
    )
}
