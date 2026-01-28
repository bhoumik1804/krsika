import { GunnyActionDialog } from './gunny-action-dialog'
import { GunnyDeleteDialog } from './gunny-delete-dialog'
import { useGunny } from './gunny-provider'

export function GunnyDialogs() {
    const { open, setOpen, currentRow } = useGunny()

    return (
        <>
            <GunnyActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
            />
            <GunnyDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
            />
        </>
    )
}
