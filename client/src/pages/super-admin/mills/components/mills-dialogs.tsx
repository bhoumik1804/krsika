import { MillsActionDialog } from './mills-action-dialog'
import { MillsDeleteDialog } from './mills-delete-dialog'
import { useMills } from './mills-provider'

export function MillsDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useMills()
    return (
        <>
            <MillsActionDialog
                key='mill-add'
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {currentRow && (
                <>
                    <MillsActionDialog
                        key={`mill-edit-${currentRow.id}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />

                    <MillsDeleteDialog
                        key={`mill-delete-${currentRow.id}`}
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />
                </>
            )}
        </>
    )
}
