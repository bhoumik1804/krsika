import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGunny } from './gunny-provider'

export function GunnyPrimaryButtons() {
    const { setOpen, setCurrentRow } = useGunny()

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
