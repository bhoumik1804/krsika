import { FactoryIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMills } from './mills-provider'

export function MillsPrimaryButtons() {
    const { setOpen } = useMills()
    return (
        <div className='flex'>
            <Button className='space-x-1' onClick={() => setOpen('add')}>
                <span>Add Mill</span> <FactoryIcon size={18} />
            </Button>
        </div>
    )
}
