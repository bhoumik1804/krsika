import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function BalanceLiftingPurchasesPaddyViewDialog({
    open,
    onOpenChange,
    currentRow,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: any
}) {
    if (!currentRow) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>View Paddy Purchase Details</DialogTitle>
                    <DialogDescription>
                        Details of the selected paddy purchase
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label>Date</Label>
                            <Input
                                value={
                                    currentRow.date
                                        ? format(
                                              new Date(currentRow.date),
                                              'MMM dd, yyyy'
                                          )
                                        : 'N/A'
                                }
                                readOnly
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Party Name</Label>
                            <Input
                                value={currentRow.partyName || 'N/A'}
                                readOnly
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Broker Name</Label>
                            <Input
                                value={currentRow.brokerName || 'N/A'}
                                readOnly
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Vehicle Number</Label>
                            <Input
                                value={currentRow.vehicleNumber || 'N/A'}
                                readOnly
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Rice Type</Label>
                            <Input
                                value={currentRow.riceType || 'N/A'}
                                readOnly
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Deal Number</Label>
                            <Input
                                value={
                                    currentRow.paddyPurchaseDealNumber || 'N/A'
                                }
                                readOnly
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Balance</Label>
                            <Input
                                value={currentRow.balance || 'N/A'}
                                readOnly
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Balance Lifting</Label>
                            <Input
                                value={currentRow.balanceLifting || 'N/A'}
                                readOnly
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Total Weight</Label>
                            <Input
                                value={currentRow.totalWeight || 'N/A'}
                                readOnly
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Bag Scale Weight</Label>
                            <Input
                                value={currentRow.bagScaleWeight || 'N/A'}
                                readOnly
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Party Weight</Label>
                            <Input
                                value={currentRow.partyWeight || 'N/A'}
                                readOnly
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Moisture</Label>
                            <Input
                                value={currentRow.moisture || 'N/A'}
                                readOnly
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Do Paddy Qty</Label>
                            <Input
                                value={currentRow.doPaddyQty || 'N/A'}
                                readOnly
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Bill Paddy Qty</Label>
                            <Input
                                value={currentRow.billPaddyQty || 'N/A'}
                                readOnly
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Actual Paddy Qty</Label>
                            <Input
                                value={currentRow.actualPaddyQty || 'N/A'}
                                readOnly
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Diff/Shortage</Label>
                            <Input
                                value={currentRow.differShortage || 'N/A'}
                                readOnly
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
