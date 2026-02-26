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

interface GunnyInwardRecord {
    gunnyNew?: number
    gunnyOld?: number
    gunnyPlastic?: number
}

interface PurchaseRecord {
    _id?: string | null
    gunnyPurchaseDealNumber?: string | null
    date?: string | null
    partyName?: string | null
    deliveryType?: string | null
    newGunnyQty?: number | null
    newGunnyRate?: number | null
    oldGunnyQty?: number | null
    oldGunnyRate?: number | null
    plasticGunnyQty?: number | null
    plasticGunnyRate?: number | null
    inwardData?: any[] | null
}

export function BalanceLiftingPurchasesGunnyViewDialog({
    open,
    onOpenChange,
    currentRow,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PurchaseRecord | null
}) {
    const { millId } = useParams()
    const [inwardData, setInwardData] = useState<GunnyInwardRecord[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchInwards = async () => {
            if (open && currentRow?.gunnyPurchaseDealNumber && millId) {
                setIsLoading(true)
                try {
                    const response = await apiClient.get(
                        `/mills/${millId}/gunny-inward?search=${currentRow.gunnyPurchaseDealNumber}`
                    )
                    setInwardData(response.data.data.entries || [])
                } catch (error) {
                    console.error('Error fetching gunny inwards:', error)
                    toast.error('Failed to fetch linked gunny inward data')
                } finally {
                    setIsLoading(false)
                }
            }
        }
        fetchInwards()
    }, [open, currentRow?.gunnyPurchaseDealNumber, millId])

    if (!currentRow) return null

    const safeNumber = (val: any) => Number(val) || 0

    // --- Calculations ---
    const totalInwardNew = inwardData.reduce(
        (acc, curr) => acc + safeNumber(curr.gunnyNew),
        0
    )
    const totalInwardOld = inwardData.reduce(
        (acc, curr) => acc + safeNumber(curr.gunnyOld),
        0
    )
    const totalInwardPlastic = inwardData.reduce(
        (acc, curr) => acc + safeNumber(curr.gunnyPlastic),
        0
    )

    const newGunnyRate = safeNumber(currentRow.newGunnyRate)
    const oldGunnyRate = safeNumber(currentRow.oldGunnyRate)
    const plasticGunnyRate = safeNumber(currentRow.plasticGunnyRate)

    const payableToParty =
        totalInwardNew * newGunnyRate +
        totalInwardOld * oldGunnyRate +
        totalInwardPlastic * plasticGunnyRate

    const handlePrint = async () => {
        const toastId = toast.loading('Generating Print Preview...')

        try {
            const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Gunny-Purchase-Report-${currentRow.gunnyPurchaseDealNumber || 'Details'}</title>
<style>
  @page {
    size: A4;
    margin: 10mm;
  }
  body {
    margin: 0;
  }
</style>
</head>

<body style="margin:0;padding:20px;background:#fff;color:#000;font-family:Arial, sans-serif;">

<div id="pdf-content" style="width:210mm;box-sizing:border-box;padding:20px;background:#fff;color:#000;">

  <div style="text-align:center;margin-bottom:10px;">
    <h2 style="font-size:15px;font-weight:bold;">बारदाना खरीदी सौदे की जानकारी</h2>
  </div>

  <!-- ================= HEADER TABLE ================= -->
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:10px;font-size:12px;">
    <tr style="border-bottom:1px solid #000;">
      <td style="padding:5px;width:20%;">बारदाना खरीदी सौदा क्रमांक -</td>
      <td style="padding:5px;width:30%;">${currentRow.gunnyPurchaseDealNumber || ''}</td>
      <td style="padding:5px;width:20%;text-align:right;">सौदा दिनांक-</td>
      <td style="padding:5px;width:30%;">${currentRow.date ? format(new Date(currentRow.date), 'dd/MM/yyyy') : ''}</td>
    </tr>
    <tr>
      <td style="padding:5px;">पार्टी का नाम -</td>
      <td style="padding:5px;" colspan="3">${currentRow.partyName || ''}</td>
    </tr>
  </table>

  <!-- ================= DEAL DETAILS TABLE ================= -->
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:10px;font-size:12px;">
    <tr style="border-bottom:1px solid #000;">
      <td colspan="2" style="padding:5px;font-weight:bold;">सौदा विवरण</td>
    </tr>

    ${[
                    ['डिलीवरी -', currentRow.deliveryType || '', 'नया बारदाना दर -', newGunnyRate.toFixed(2)],
                    ['नया बारदाना संख्या -', safeNumber(currentRow.newGunnyQty), 'पुराना बारदाना दर -', oldGunnyRate.toFixed(2)],
                    ['पुराना बारदाना संख्या -', safeNumber(currentRow.oldGunnyQty), 'प्लास्टिक बारदाना दर -', plasticGunnyRate.toFixed(2)],
                    ['प्लास्टिक बारदाना संख्या -', safeNumber(currentRow.plasticGunnyQty), '', '']
                ].map(row => `
      <tr>
        <td style="padding:5px;width:50%;border-right:1px solid #000;">
          <span style="display:inline-block;width:130px;">${row[0]}</span> ${row[1]}
        </td>
        <td style="padding:5px;width:50%;">
          ${row[2] ? `<span style="display:inline-block;width:130px;">${row[2]}</span> ${row[3]}` : ''}
        </td>
      </tr>
    `).join('')}

  </table>

  <!-- ================= SUMMARY TABLE ================= -->
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;font-size:12px;">
    ${[
                    ['बारदाना आवक (New/Old/Plastic)', `${totalInwardNew} / ${totalInwardOld} / ${totalInwardPlastic}`],
                    ['पार्टी को भुगतान योग्य राशि', payableToParty.toFixed(2), true]
                ].map(row => `
      <tr style="border-bottom:1px solid #000;">
        <td style="padding:5px;width:60%;border-right:1px solid #000;${row[2] ? 'font-weight:bold;' : ''}">
          ${row[0]}
        </td>
        <td style="padding:5px;width:40%;text-align:right;${row[2] ? 'font-weight:bold;' : ''}">
          ${row[1]}
        </td>
      </tr>
    `).join('')}
  </table>

</div>
</body>
</html>
`.trim();

            const iframe = document.createElement('iframe')
            iframe.style.position = 'absolute'
            iframe.style.left = '-9999px'
            iframe.style.width = '210mm'
            document.body.appendChild(iframe)
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
            if (!iframeDoc) throw new Error('Could not access iframe document')
            iframeDoc.open()
            iframeDoc.write(html)
            iframeDoc.close()

            // Wait for rendering
            setTimeout(() => {
                iframe.contentWindow?.focus()
                iframe.contentWindow?.print()
                setTimeout(() => {
                    document.body.removeChild(iframe)
                }, 1000)
                toast.success('Print dialog opened', { id: toastId })
            }, 500)
        } catch (error) {
            console.error('Error generating PDF:', error)
            toast.error(
                `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
                { id: toastId }
            )
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-5xl overflow-hidden'>
                <DialogHeader>
                    <DialogTitle>View Gunny Purchase Details</DialogTitle>
                </DialogHeader>

                <div className='max-h-[75vh] overflow-y-auto p-2'>
                    <div className='bg-white p-4 text-black'>
                        {/* Header Section */}
                        <div className='mb-6 flex flex-col items-center'>
                            <h2 className='mb-1 text-center text-xl font-bold underline'>
                                बारदाना खरीदी सौदे की जानकारी
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
                                    बारदाना खरीदी सौदा क्रमांक:
                                </span>
                                <span>
                                    {currentRow.gunnyPurchaseDealNumber ||
                                        'N/A'}
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
                            <div className='col-span-2 flex justify-between'>
                                <span className='font-bold'>
                                    पार्टी का नाम:
                                </span>
                                <span>{currentRow.partyName || 'N/A'}</span>
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
                                            नया बारदाना दर:
                                        </span>{' '}
                                        {newGunnyRate.toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-black p-2'>
                                        <span className='font-bold'>
                                            नया बारदाना संख्या:
                                        </span>{' '}
                                        {safeNumber(currentRow.newGunnyQty)}
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
                                            पुराना बारदाना संख्या:
                                        </span>{' '}
                                        {safeNumber(currentRow.oldGunnyQty)}
                                    </td>
                                    <td className='border border-black p-2'>
                                        <span className='font-bold'>
                                            प्लास्टिक बारदाना दर:
                                        </span>{' '}
                                        {plasticGunnyRate.toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-black p-2'>
                                        <span className='font-bold'>
                                            प्लास्टिक बारदाना संख्या:
                                        </span>{' '}
                                        {safeNumber(currentRow.plasticGunnyQty)}
                                    </td>
                                    <td className='border border-black p-2'></td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Calculation Summary Table */}
                        <table className='w-full border-collapse border border-black text-sm'>
                            <tbody>
                                <tr>
                                    <td className='w-1/2 border border-black p-2 align-middle font-bold'>
                                        बारदाना आवक/ समिति-संग्रहण में जमा
                                    </td>
                                    <td className='w-1/2 border border-black p-0'>
                                        <div className='divide-y divide-black'>
                                            <div className='flex justify-between p-2'>
                                                <span>नया बारदाना -</span>
                                                <span>{totalInwardNew}</span>
                                            </div>
                                            <div className='flex justify-between p-2'>
                                                <span>पुराना बारदाना -</span>
                                                <span>{totalInwardOld}</span>
                                            </div>
                                            <div className='flex justify-between p-2'>
                                                <span>प्लास्टिक बारदाना -</span>
                                                <span>
                                                    {totalInwardPlastic}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr className='bg-gray-100'>
                                    <td className='border border-black p-3 text-base font-bold'>
                                        पार्टी को भुगतान योग्य राशि
                                    </td>
                                    <td className='border border-black p-3 text-right text-base font-bold'>
                                        {payableToParty.toFixed(2)}
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
