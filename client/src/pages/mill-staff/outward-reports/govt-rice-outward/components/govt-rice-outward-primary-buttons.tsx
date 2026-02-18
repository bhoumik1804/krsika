import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGovtRiceOutward } from './govt-rice-outward-provider'

export function GovtRiceOutwardPrimaryButtons() {
    const { setOpen } = useGovtRiceOutward()

    return (
        <Button onClick={() => setOpen('add')}>
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
