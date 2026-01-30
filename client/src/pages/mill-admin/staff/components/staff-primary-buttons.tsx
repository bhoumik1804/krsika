import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStaff } from './staff-provider'

export function StaffPrimaryButtons() {
    const { setOpen } = useStaff()
    return (
        <div className='flex gap-2'>
            <Button className='space-x-1' onClick={() => setOpen('add')}>
                <span>Add Staff</span> <UserPlus size={18} />
            </Button>
        </div>
    )
}
