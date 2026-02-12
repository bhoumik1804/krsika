import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGovtPaddyInward } from './govt-paddy-inward-provider'

export function GovtPaddyInwardPrimaryButtons() {
    const { setOpen, setCurrentRow } = useGovtPaddyInward()

    return (
        <Button
            onClick={() => {
                setCurrentRow(null)
                setOpen('add')
            }}
        >
            <Plus className='mr-2 size-4' />
            Add Record
        </Button>
    )
}
