import { KhandaOutwardActionDialog } from './khanda-outward-action-dialog'
import { KhandaOutwardDeleteDialog } from './khanda-outward-delete-dialog'
import { khandaOutward } from './khanda-outward-provider'

type KhandaOutwardDialogsProps = {
    millId: string
}

export function KhandaOutwardDialogs({ millId }: KhandaOutwardDialogsProps) {
    const { open, setOpen, currentRow } = khandaOutward()

    return (
        <>
            <KhandaOutwardActionDialog
                open={open === 'add' || open === 'edit'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? open : null)
                }
                currentRow={currentRow}
                millId={millId}
            />
            <KhandaOutwardDeleteDialog
                open={open === 'delete'}
                onOpenChange={(isOpen: boolean) =>
                    setOpen(isOpen ? 'delete' : null)
                }
                currentRow={currentRow}
                millId={millId}
            />
        </>
    )
}
