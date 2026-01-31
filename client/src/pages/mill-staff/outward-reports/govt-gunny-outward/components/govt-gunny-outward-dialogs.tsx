import { GovtGunnyOutwardActionDialog } from './govt-gunny-outward-action-dialog'
import { GovtGunnyOutwardDeleteDialog } from './govt-gunny-outward-delete-dialog'
import { GovtGunnyOutwardMultiDeleteDialog } from './govt-gunny-outward-multi-delete-dialog'
import { useGovtGunnyOutwardContext } from './govt-gunny-outward-provider'

export function GovtGunnyOutwardDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } =
        useGovtGunnyOutwardContext()
    return (
        <>
            <GovtGunnyOutwardActionDialog
                key='govt-gunny-outward-add'
                open={open === 'add'}
                onOpenChange={(isOpen) => setOpen(isOpen ? 'add' : null)}
                currentRow={currentRow}
            />
            {currentRow && (
                <>
                    <GovtGunnyOutwardActionDialog
                        key={`govt-gunny-outward-edit-${currentRow.date}`}
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
                    <GovtGunnyOutwardDeleteDialog
                        key={`govt-gunny-outward-delete-${currentRow.date}`}
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
            <GovtGunnyOutwardMultiDeleteDialog
                key='govt-gunny-outward-multi-delete'
                open={open === 'delete-multi'}
                onOpenChange={(isOpen) =>
                    setOpen(isOpen ? 'delete-multi' : null)
                }
            />
        </>
    )
}
