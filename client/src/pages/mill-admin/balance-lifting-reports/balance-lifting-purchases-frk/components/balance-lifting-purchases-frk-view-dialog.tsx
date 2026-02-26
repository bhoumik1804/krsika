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

interface FrkInwardRecord {
    netWeight?: number
}

interface PurchaseRecord {
    _id?: string | null
    frkPurchaseDealNumber?: string | null
    date?: string | null
    partyName?: string | null
    frkQty?: number | null
    frkRate?: number | null
    gst?: number | null
    inwardData?: any[] | null
}

export function BalanceLiftingPurchasesFrkViewDialog({
    open,
    onOpenChange,
    currentRow,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PurchaseRecord | null
}) {
    const { millId } = useParams()
    const [inwardData, setInwardData] = useState<FrkInwardRecord[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchInwards = async () => {
            if (open && currentRow?.frkPurchaseDealNumber && millId) {
                setIsLoading(true)
                try {
                    const response = await apiClient.get(
                        `/mills/${millId}/frk-inward?search=${currentRow.frkPurchaseDealNumber}`
                    )
                    setInwardData(response.data.data.entries || [])
                } catch (error) {
                    console.error('Error fetching frk inwards:', error)
                    toast.error('Failed to fetch linked frk inward data')
                } finally {
                    setIsLoading(false)
                }
            }
        }
        fetchInwards()
    }, [open, currentRow?.frkPurchaseDealNumber, millId])

    if (!currentRow) return null

    const safeNumber = (val: any) => Number(val) || 0

    // --- Calculations ---
    const totalInwardQty = inwardData.reduce(
        (acc, curr) => acc + safeNumber(curr.netWeight),
        0
    )

    const frkRate = safeNumber(currentRow.frkRate)
    const basicAmount = totalInwardQty * frkRate

    const gstPercent = safeNumber(currentRow.gst)
    const cgst = basicAmount * (gstPercent / 2 / 100)
    const sgst = basicAmount * (gstPercent / 2 / 100)
    const payableToParty = basicAmount + cgst + sgst

    const handlePrint = async () => {
        const toastId = toast.loading('Generating Print Preview...')

        try {
            const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>FRK-Purchase-Report-${currentRow.frkPurchaseDealNumber || 'Details'}</title>
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
    <h2 style="font-size:15px;font-weight:bold;">FRK खरीदी सौदे की जानकारी</h2>
  </div>

  <!-- ================= HEADER TABLE ================= -->
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:10px;font-size:12px;">
    <tr style="border-bottom:1px solid #000;">
      <td style="padding:5px;width:20%;">FRK खरीदी सौदा क्रमांक -</td>
      <td style="padding:5px;width:30%;">${currentRow.frkPurchaseDealNumber || ''}</td>
      <td style="padding:5px;width:20%;text-align:right;">सौदा दिनांक-</td>
      <td style="padding:5px;width:30%;">${currentRow.date ? format(new Date(currentRow.date), 'dd/MM/yyyy') : ''}</td>
    </tr>
    <tr>
      <td style="padding:5px;">पार्टी का नाम -</td>
      <td style="padding:5px;" colspan="3">${currentRow.partyName || ''}</td>
    </tr>
  </table>

  <!-- ================= SUMMARY TABLE ================= -->
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;font-size:12px;">
    ${[
                    ['FRK मात्रा (किंतल में)', totalInwardQty.toFixed(2), false, frkRate.toFixed(2)],
                    ['Basic Amount', basicAmount.toFixed(2)],
                    [`CGST (${(gstPercent / 2).toFixed(1)}%)`, cgst.toFixed(2)],
                    [`SGST (${(gstPercent / 2).toFixed(1)}%)`, sgst.toFixed(2)],
                    ['पार्टी को भुगतान योग्य राशि', payableToParty.toFixed(2), true]
                ].map(row => `
      <tr style="border-bottom:1px solid #000;">
        <td style="padding:5px;width:60%;border-right:1px solid #000;${row[2] ? 'font-weight:bold;' : ''}">
          ${row[0]} ${row[3] ? `(Rate: ${row[3]})` : ''}
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
                    <DialogTitle>View FRK Purchase Details</DialogTitle>
                </DialogHeader>

                <div className='max-h-[75vh] overflow-y-auto p-2'>
                    <div className='bg-white p-4 text-black'>
                        {/* Header Section */}
                        <div className='mb-6 flex flex-col items-center'>
                            <h2 className='mb-1 text-center text-xl font-bold underline'>
                                FRK खरीदी सौदे की जानकारी
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
                                    FRK खरीदी सौदा क्रमांक:
                                </span>
                                <span>
                                    {currentRow.frkPurchaseDealNumber || 'N/A'}
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
                        <table className='w-full border-collapse border border-black text-sm'>
                            <thead>
                                <tr className='bg-gray-100'>
                                    <th className='border border-black p-2 text-left font-bold'>
                                        विवरण
                                    </th>
                                    <th className='border border-black p-2 text-right font-bold'>
                                        मात्रा
                                    </th>
                                    <th className='border border-black p-2 text-right font-bold'>
                                        दर
                                    </th>
                                    <th className='border border-black p-2 text-right font-bold'>
                                        राशि
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='border border-black p-2 font-bold'>
                                        FRK मात्रा (किंटल में)
                                    </td>
                                    <td className='border border-black p-2 text-right'>
                                        {totalInwardQty.toFixed(2)}
                                    </td>
                                    <td className='border border-black p-2 text-right'>
                                        {frkRate.toFixed(2)}
                                    </td>
                                    <td className='border border-black p-2 text-right'>
                                        {basicAmount.toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className='border border-black p-2 text-right font-bold'
                                        colSpan={3}
                                    >
                                        CGST ({(gstPercent / 2).toFixed(1)}%)
                                    </td>
                                    <td className='border border-black p-2 text-right'>
                                        {cgst.toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className='border border-black p-2 text-right font-bold'
                                        colSpan={3}
                                    >
                                        SGST ({(gstPercent / 2).toFixed(1)}%)
                                    </td>
                                    <td className='border border-black p-2 text-right'>
                                        {sgst.toFixed(2)}
                                    </td>
                                </tr>
                                <tr className='bg-gray-100'>
                                    <td
                                        className='border border-black p-3 text-base font-bold'
                                        colSpan={3}
                                    >
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
