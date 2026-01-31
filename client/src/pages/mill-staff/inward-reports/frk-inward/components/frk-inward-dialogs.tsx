import { FrkInwardActionDialog } from './frk-inward-action-dialog'
import { FrkInwardDeleteDialog } from './frk-inward-delete-dialog'
import { useFrkInward } from './frk-inward-provider'

export function FrkInwardDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useFrkInward()

    return (
        <>
            <FrkInwardActionDialog
                key='frk-inward-add'
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
                currentRow={null}
            />

            {currentRow && (
                <>
                    <FrkInwardActionDialog
                        key={`frk-inward-edit-${currentRow.purchaseDealId}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen(null)
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />
                    <FrkInwardDeleteDialog
                        key={`frk-inward-delete-${currentRow.purchaseDealId}`}
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen(null)
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
