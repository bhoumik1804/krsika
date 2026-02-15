import { PaddySalesActionDialog } from './paddy-sales-action-dialog'
import { PaddySalesDeleteDialog } from './paddy-sales-delete-dialog'
import { usePaddySales } from './paddy-sales-provider'

export function PaddySalesDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = usePaddySales()

    return (
        <>
            <PaddySalesActionDialog
                open={open === 'add'}
                onOpenChange={(isOpen) => setOpen(isOpen ? 'add' : null)}
            />

            {currentRow && (
                <>
                    <PaddySalesActionDialog
                        open={open === 'edit'}
                        onOpenChange={(isOpen) => {
                            setOpen(isOpen ? 'edit' : null)
                            if (!isOpen) {
                                setTimeout(() => {
                                    setCurrentRow(null)
                                }, 500)
                            }
                        }}
                        currentRow={currentRow}
                    />
                    <PaddySalesDeleteDialog
                        open={open === 'delete'}
                        onOpenChange={(isOpen) => {
                            setOpen(isOpen ? 'delete' : null)
                            if (!isOpen) {
                                setTimeout(() => {
                                    setCurrentRow(null)
                                }, 500)
                            }
                        }}
                        currentRow={currentRow}
                    />
                </>
            )}
        </>
    )
}
