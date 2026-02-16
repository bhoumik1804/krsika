import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Printer } from 'lucide-react'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface RiceInwardRecord {
    riceMotaNetWeight?: number
    ricePatlaNetWeight?: number
    gunnyNew?: number
    gunnyOld?: number
    gunnyPlastic?: number
}

interface PurchaseRecord {
    _id?: string | null
    ricePurchaseDealNumber?: string | null
    date?: string | null
    partyName?: string | null
    brokerName?: string | null
    deliveryType?: string | null
    lotOrOther?: string | null
    fciOrNAN?: string | null
    riceType?: string | null
    frkType?: string | null
    frkRatePerQuintal?: number | null
    riceRate?: number | null
    discountPercent?: number | null
    brokeragePerQuintal?: number | null
    gunnyType?: string | null
    newGunnyRate?: number | null
    oldGunnyRate?: number | null
    plasticGunnyRate?: number | null
    riceQty?: number | null
    lotNumber?: string | null
    inwardData?: any[] | null
}

export function BalanceLiftingPurchasesRiceViewDialog({
    open,
    onOpenChange,
    currentRow,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PurchaseRecord | null
}) {
    const { millId } = useParams()
    const [inwardData, setInwardData] = useState<RiceInwardRecord[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchInwards = async () => {
            if (open && currentRow?.ricePurchaseDealNumber && millId) {
                setIsLoading(true)
                try {
                    const response = await apiClient.get(
                        `/mills/${millId}/rice-inward?search=${currentRow.ricePurchaseDealNumber}`
                    )
                    setInwardData(response.data.data.entries || [])
                } catch (error) {
                    console.error('Error fetching inwards:', error)
                    toast.error('Failed to fetch linked inward data')
                } finally {
                    setIsLoading(false)
                }
            }
        }
        fetchInwards()
    }, [open, currentRow?.ricePurchaseDealNumber, millId])

    if (!currentRow) return null

    const safeNumber = (val: any) => Number(val) || 0

    // --- Calculations ---
    const lifting = inwardData.reduce(
        (acc, curr) =>
            acc +
            safeNumber(curr.riceMotaNetWeight) +
            safeNumber(curr.ricePatlaNetWeight),
        0
    )

    const riceRate = safeNumber(currentRow.riceRate)
    const riceAmount = lifting * riceRate

    const discountPercent = safeNumber(currentRow.discountPercent)
    const discountAmount = riceAmount * (discountPercent / 100)

    const totalNewGunny = inwardData.reduce(
        (acc, curr) => acc + safeNumber(curr.gunnyNew),
        0
    )
    const totalOldGunny = inwardData.reduce(
        (acc, curr) => acc + safeNumber(curr.gunnyOld),
        0
    )
    const totalPlasticGunny = inwardData.reduce(
        (acc, curr) => acc + safeNumber(curr.gunnyPlastic),
        0
    )

    const newGunnyRate = safeNumber(currentRow.newGunnyRate)
    const oldGunnyRate = safeNumber(currentRow.oldGunnyRate)
    const plasticGunnyRate = safeNumber(currentRow.plasticGunnyRate)

    const gunnyAmount =
        totalNewGunny * newGunnyRate +
        totalOldGunny * oldGunnyRate +
        totalPlasticGunny * plasticGunnyRate

    const payableToParty = riceAmount + gunnyAmount - discountAmount

    const brokerage = safeNumber(currentRow.brokeragePerQuintal)
    const payableToBroker = lifting * brokerage

    const handlePrint = async () => {
        const toastId = toast.loading('Generating Print Preview...')

        try {
            const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;background:#fff;color:#000;font-family:sans-serif;">
<div id="print-content" style="width:210mm;background:#fff;color:#000;margin:0 auto;">
  <div style="margin-bottom:24px;display:flex;flex-direction:column;align-items:center;">
    <h2 style="margin:0 0 4px;font-size:20px;font-weight:bold;text-decoration:underline;">चावल खरीदी सौडे की जानकारी</h2>
    <p style="margin:0;font-size:12px;color:#6b7280;">Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
  </div>
  
  <div style="margin-bottom:24px;display:grid;grid-template-columns:1fr 1fr;gap:8px 32px;border:1px solid #e5e7eb;border-radius:6px;padding:16px;font-size:14px;">
    <div style="display:flex;justify-content:space-between;"><span style="font-weight:bold;">चावल खरीदी सौदा क्रमांक:</span><span>${currentRow.ricePurchaseDealNumber || 'N/A'}</span></div>
    <div style="display:flex;justify-content:space-between;"><span style="font-weight:bold;">सौदा दिनांक:</span><span>${currentRow.date ? format(new Date(currentRow.date), 'dd/MM/yyyy') : 'N/A'}</span></div>
    <div style="display:flex;justify-content:space-between;"><span style="font-weight:bold;">पार्टी का नाम:</span><span>${currentRow.partyName || 'N/A'}</span></div>
    <div style="display:flex;justify-content:space-between;"><span style="font-weight:bold;">ब्रोकर का नाम:</span><span>${currentRow.brokerName || 'N/A'}</span></div>
  </div>

  <table style="margin-bottom:24px;width:100%;border-collapse:collapse;border:1px solid #000;font-size:14px;">
    <thead><tr><th colspan="2" style="border:1px solid #000;background:#f3f4f6;padding:8px;text-align:center;font-weight:bold;">सौदा विवरण</th></tr></thead>
    <tbody>
      <tr>
        <td style="width:50%;border:1px solid #000;padding:8px;"><span style="font-weight:bold;">डिलीवरी:</span> ${currentRow.deliveryType || 'N/A'}</td>
        <td style="width:50%;border:1px solid #000;padding:8px;"><span style="font-weight:bold;">चावल का भाव/दर:</span> ${riceRate.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">LOT/अन्य:</span> ${currentRow.lotOrOther || 'N/A'}</td>
        <td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">बटाव %:</span> ${discountPercent}%</td>
      </tr>
      <tr>
        <td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">FCI/NAN:</span> ${currentRow.fciOrNAN || 'N/A'}</td>
        <td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">दलाली:</span> ${brokerage.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">चावल का प्रकार:</span> ${currentRow.riceType || 'N/A'}</td>
        <td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">बारदाना सहित/वापसी:</span> ${currentRow.gunnyType || 'N/A'}</td>
      </tr>
      <tr>
        <td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">FRK:</span> ${currentRow.frkType || 'N/A'}</td>
        <td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">नया बारदाना दर:</span> ${newGunnyRate.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">FRK दर (प्रति किं.):</span> ${safeNumber(currentRow.frkRatePerQuintal).toFixed(2)}</td>
        <td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">पुराना बारदाना दर:</span> ${oldGunnyRate.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">LOT No.:</span> ${currentRow.lotNumber || 'N/A'}</td>
        <td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">प्लास्टिक बारदाना दर:</span> ${plasticGunnyRate.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

  <table style="width:100%;border-collapse:collapse;border:1px solid #000;font-size:14px;">
    <tbody>
      <tr><td style="width:66%;border:1px solid #000;padding:8px;font-weight:bold;">आवक / LOT जमा</td><td style="width:33%;border:1px solid #000;padding:8px;text-align:right;">${lifting.toFixed(2)}</td></tr>
      <tr><td style="border:1px solid #000;padding:8px;font-weight:bold;">धान की राशि (उठाव * दर)</td><td style="border:1px solid #000;padding:8px;text-align:right;">${riceAmount.toFixed(2)}</td></tr>
      <tr><td style="border:1px solid #000;padding:8px;font-weight:bold;">(-) बटाव राशि (${discountPercent}%)</td><td style="border:1px solid #000;padding:8px;text-align:right;color:#dc2626;">${discountAmount.toFixed(2)}</td></tr>
      <tr><td style="border:1px solid #000;padding:8px;font-weight:bold;">(+) बारदाने की राशि<div style="font-size:12px;font-weight:normal;color:#6b7280;">(New: ${totalNewGunny}, Old: ${totalOldGunny}, Plastic: ${totalPlasticGunny})</div></td><td style="border:1px solid #000;padding:8px;text-align:right;vertical-align:top;">${gunnyAmount.toFixed(2)}</td></tr>
      <tr style="background:#f3f4f6;"><td style="border:1px solid #000;padding:8px;font-size:16px;font-weight:bold;">पार्टी को भुगतान योग्य राशि</td><td style="border:1px solid #000;padding:8px;text-align:right;font-size:16px;font-weight:bold;">${payableToParty.toFixed(2)}</td></tr>
      <tr><td style="border:1px solid #000;padding:8px;font-weight:bold;">ब्रोकर को भुगतान योग्य राशि (उठाव * दलाली)</td><td style="border:1px solid #000;padding:8px;text-align:right;">${payableToBroker.toFixed(2)}</td></tr>
    </tbody>
  </table>
</div>
</body>
</html>
            `.trim()

            const iframe = document.createElement('iframe')
            iframe.style.position = 'absolute'
            iframe.style.left = '-9999px'
            document.body.appendChild(iframe)
            const iframeDoc =
                iframe.contentDocument || iframe.contentWindow?.document
            if (!iframeDoc) throw new Error('Could not access iframe document')
            iframeDoc.open()
            iframeDoc.write(html)
            iframeDoc.close()

            // Wait for images if any, or just a bit for rendering
            setTimeout(() => {
                iframe.contentWindow?.focus()
                iframe.contentWindow?.print()
                setTimeout(() => {
                    document.body.removeChild(iframe)
                }, 1000)
                toast.success('Print dialog opened', { id: toastId })
            }, 500)
        } catch (error) {
            console.error('Error printing:', error)
            toast.error('Failed to prepare print document', { id: toastId })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-5xl overflow-hidden'>
                <DialogHeader>
                    <DialogTitle>View Rice Purchase Details</DialogTitle>
                </DialogHeader>

                <div className='max-h-[75vh] overflow-y-auto p-2'>
                    <div className='bg-white p-4 text-black'>
                        {/* Header Section */}
                        <div className='mb-6 flex flex-col items-center'>
                            <h2 className='mb-1 text-xl font-bold underline'>
                                चावल खरीदी सौदे की जानकारी
                            </h2>
                            <p className='text-xs text-gray-500'>
                                Generated on:{' '}
                                {format(new Date(), 'dd/MM/yyyy HH:mm')}
                            </p>
                        </div>

                        {/* Top Info Grid */}
                        <div className='mb-6 grid grid-cols-2 gap-x-8 gap-y-2 rounded-md border border-gray-200 p-4 text-sm'>
                            <div className='flex justify-between'>
                                <span className='font-bold'>
                                    चावल खरीदी सौदा क्रमांक:
                                </span>
                                <span>
                                    {currentRow.ricePurchaseDealNumber || 'N/A'}
                                </span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='font-bold'>सौदा दिनांक:</span>
                                <span>
                                    {currentRow.date
                                        ? format(
                                              new Date(currentRow.date),
                                              'dd/MM/yyyy'
                                          )
                                        : 'N/A'}
                                </span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='font-bold'>
                                    पार्टी का नाम:
                                </span>
                                <span>{currentRow.partyName || 'N/A'}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='font-bold'>
                                    ब्रोकर का नाम:
                                </span>
                                <span>{currentRow.brokerName || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Details Table */}
                        <table className='mb-6 w-full border-collapse border border-black text-sm'>
                            <thead>
                                <tr>
                                    <th
                                        colSpan={2}
                                        className='border border-black bg-gray-100 p-2 text-center font-bold'
                                    >
                                        सौदा विवरण
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='w-1/2 border border-black p-2'>
                                        <span className='font-bold'>
                                            डिलीवरी:
                                        </span>{' '}
                                        {currentRow.deliveryType || 'N/A'}
                                    </td>
                                    <td className='w-1/2 border border-black p-2'>
                                        <span className='font-bold'>
                                            चावल का भाव/दर:
                                        </span>{' '}
                                        {riceRate.toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-black p-2'>
                                        <span className='font-bold'>
                                            LOT/अन्य:
                                        </span>{' '}
                                        {currentRow.lotOrOther || 'N/A'}
                                    </td>
                                    <td className='border border-black p-2'>
                                        <span className='font-bold'>
                                            बटाव %:
                                        </span>{' '}
                                        {discountPercent}%
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-black p-2'>
                                        <span className='font-bold'>
                                            FCI/NAN:
                                        </span>{' '}
                                        {currentRow.fciOrNAN || 'N/A'}
                                    </td>
                                    <td className='border border-black p-2'>
                                        <span className='font-bold'>
                                            दलाली:
                                        </span>{' '}
                                        {brokerage.toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-black p-2'>
                                        <span className='font-bold'>
                                            चावल का प्रकार:
                                        </span>{' '}
                                        {currentRow.riceType || 'N/A'}
                                    </td>
                                    <td className='border border-black p-2'>
                                        <span className='font-bold'>
                                            बारदाना सहित/वापसी:
                                        </span>{' '}
                                        {currentRow.gunnyType || 'N/A'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-black p-2'>
                                        <span className='font-bold'>FRK:</span>{' '}
                                        {currentRow.frkType || 'N/A'}
                                    </td>
                                    <td className='border border-black p-2'>
                                        <span className='font-bold'>
                                            नया बारदाना दर:
                                        </span>{' '}
                                        {newGunnyRate.toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-black p-2'>
                                        <span className='font-bold'>
                                            FRK दर (प्रति किं.):
                                        </span>{' '}
                                        {safeNumber(
                                            currentRow.frkRatePerQuintal
                                        ).toFixed(2)}
                                    </td>
                                    <td className='border border-black p-2'>
                                        <span className='font-bold'>
                                            पुराना बारदाना दर:
                                        </span>{' '}
                                        {oldGunnyRate.toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-black p-2'>
                                        <span className='font-bold'>
                                            LOT No.:
                                        </span>{' '}
                                        {currentRow.lotNumber || 'N/A'}
                                    </td>
                                    <td className='border border-black p-2'>
                                        <span className='font-bold'>
                                            प्लास्टिक बारदाना दर:
                                        </span>{' '}
                                        {plasticGunnyRate.toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Calculation Summary Table */}
                        <table className='w-full border-collapse border border-black text-sm'>
                            <tbody>
                                <tr>
                                    <td className='w-2/3 border border-black p-2 font-bold'>
                                        आवक / LOT जमा
                                    </td>
                                    <td className='w-1/3 border border-black p-2 text-right'>
                                        {lifting.toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-black p-2 font-bold'>
                                        धान की राशि (उठाव * दर)
                                    </td>
                                    <td className='border border-black p-2 text-right'>
                                        {riceAmount.toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-black p-2 font-bold'>
                                        (-) बटाव राशि ({discountPercent}%)
                                    </td>
                                    <td className='border border-black p-2 text-right text-red-600'>
                                        {discountAmount.toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-black p-2 font-bold'>
                                        (+) बारदाने की राशि
                                        <div className='text-xs font-normal text-gray-500'>
                                            (New: {totalNewGunny}, Old:{' '}
                                            {totalOldGunny}, Plastic:{' '}
                                            {totalPlasticGunny})
                                        </div>
                                    </td>
                                    <td className='border border-black p-2 text-right align-top'>
                                        {gunnyAmount.toFixed(2)}
                                    </td>
                                </tr>
                                <tr className='bg-gray-100'>
                                    <td className='border border-black p-2 text-base font-bold'>
                                        पार्टी को भुगतान योग्य राशि
                                    </td>
                                    <td className='border border-black p-2 text-right text-base font-bold'>
                                        {payableToParty.toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-black p-2 font-bold'>
                                        ब्रोकर को भुगतान योग्य राशि (उठाव *
                                        दलाली)
                                    </td>
                                    <td className='border border-black p-2 text-right'>
                                        {payableToBroker.toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='flex justify-end gap-2 p-4 pt-0'>
                    <Button
                        variant='outline'
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                    <Button onClick={handlePrint} disabled={isLoading}>
                        <Printer className='mr-2 h-4 w-4' />
                        Print / Export PDF
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
