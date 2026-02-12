import { PrivateGunnyOutwardActionDialog } from './private-gunny-outward-action-dialog'
import { PrivateGunnyOutwardDeleteDialog } from './private-gunny-outward-delete-dialog'
import { usePrivateGunnyOutward } from './private-gunny-outward-provider'

export function PrivateGunnyOutwardDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } =
        usePrivateGunnyOutward()
    return (
        <>
            <PrivateGunnyOutwardActionDialog
                key='private-gunny-outward-add'
                open={open === 'add'}
                onOpenChange={(isOpen) => setOpen(isOpen ? 'add' : null)}
                currentRow={currentRow}
            />
            {currentRow && (
                <>
                    <PrivateGunnyOutwardActionDialog
                        key={`private-gunny-outward-edit-${currentRow._id}`}
                        open={open === 'edit'}
                        onOpenChange={(isOpen) => {
                            if (isOpen) {
                                setOpen('edit')
                            } else {
                                setOpen(null)
                                setTimeout(() => {
                                    setCurrentRow(null)
                                }, 500)
                            }
                        }}
                        currentRow={currentRow}
                    />
                    <PrivateGunnyOutwardDeleteDialog
                        key={`private-gunny-outward-delete-${currentRow._id}`}
                        open={open === 'delete'}
                        onOpenChange={(isOpen) => {
                            if (isOpen) {
                                setOpen('delete')
                            } else {
                                setOpen(null)
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
