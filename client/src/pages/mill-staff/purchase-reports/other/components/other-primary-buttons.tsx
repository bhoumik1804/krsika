import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOther } from './other-provider'

export function OtherPrimaryButtons() {
    const { setOpen, setCurrentRow } = useOther()

    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            Add Purchase
        </Button>
    )
}
