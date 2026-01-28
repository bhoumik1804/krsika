import { OtherInwardActionDialog } from './other-inward-action-dialog'
import { OtherInwardDeleteDialog } from './other-inward-delete-dialog'
import { useOtherInward } from './other-inward-provider'

export function OtherInwardDialogs() {
    const { open, setOpen, currentRow } = useOtherInward()
    return (
        <>
            <OtherInwardActionDialog
                key='other-inward-add'
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
                currentRow={null}
            />

            {currentRow && (
                <>
                    <OtherInwardActionDialog
                        key={`other-inward-edit-${currentRow.itemName}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen(null)
                            // setTimeout(() => setCurrentRow(null), 500)
                        }}
                        currentRow={currentRow}
                    />

                    <OtherInwardDeleteDialog
                        key={`other-inward-delete-${currentRow.itemName}`}
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen(null)
                            // setTimeout(() => setCurrentRow(null), 500)
                        }}
                    />
                </>
            )}
        </>
    )
}
