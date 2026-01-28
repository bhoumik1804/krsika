import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, Zap, CheckCircle, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type Mill } from '../data/schema'
import { MillsMultiDeleteDialog } from './mills-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    const selectedMills = selectedRows.map((row) => row.original as Mill)
    toast.promise(sleep(2000), {
      loading: `${status === 'active' ? 'Activating' : 'Deactivating'} mills...`,
      success: () => {
        table.resetRowSelection()
        return `${status === 'active' ? 'Activated' : 'Deactivated'} ${selectedMills.length} mill${selectedMills.length > 1 ? 's' : ''}`
      },
      error: `Error ${status === 'active' ? 'activating' : 'deactivating'} mills`,
    })
    table.resetRowSelection()
  }

  const handleBulkInvite = () => {
    const selectedMills = selectedRows.map((row) => row.original as Mill)
    toast.promise(sleep(2000), {
      loading: 'Inviting mills...',
      success: () => {
        table.resetRowSelection()
        return `Invited ${selectedMills.length} mill${selectedMills.length > 1 ? 's' : ''}`
      },
      error: 'Error inviting mills',
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='mill'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={handleBulkInvite}
              className='size-8'
              aria-label='Invite selected mills'
              title='Invite selected mills'
            >
              <Mail />
              <span className='sr-only'>Invite selected mills</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Invite selected mills</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label='Activate selected mills'
              title='Activate selected mills'
            >
              <CheckCircle />
              <span className='sr-only'>Activate selected mills</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Activate selected mills</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label='Deactivate selected mills'
              title='Deactivate selected mills'
            >
              <Zap />
              <span className='sr-only'>Deactivate selected mills</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Deactivate selected mills</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected mills'
              title='Delete selected mills'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected mills</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected mills</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <MillsMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
