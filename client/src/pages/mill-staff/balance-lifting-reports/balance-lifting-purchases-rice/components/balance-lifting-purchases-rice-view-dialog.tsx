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
<head>
<meta charset="utf-8">
<title>Rice-Purchase-Report-${currentRow.ricePurchaseDealNumber || 'Details'}</title>
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
    <h2 style="font-size:15px;font-weight:bold;">चावल खरीदी सौडे की जानकारी</h2>
  </div>

  <!-- ================= HEADER TABLE ================= -->
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:10px;font-size:12px;">
    <tr style="border-bottom:1px solid #000;">
      <td style="padding:5px;width:20%;">चावल खरीदी सौदा क्रमांक -</td>
      <td style="padding:5px;width:30%;">${currentRow.ricePurchaseDealNumber || ''}</td>
      <td style="padding:5px;width:20%;text-align:right;">सौदा दिनांक-</td>
      <td style="padding:5px;width:30%;">${currentRow.date ? format(new Date(currentRow.date), 'dd/MM/yyyy') : ''}</td>
    </tr>
    <tr>
      <td style="padding:5px;">पार्टी का नाम -</td>
      <td style="padding:5px;" colspan="3">${currentRow.partyName || ''}</td>
    </tr>
    <tr>
      <td style="padding:5px;">ब्रोकर का नाम -</td>
      <td style="padding:5px;" colspan="3">${currentRow.brokerName || ''}</td>
    </tr>
  </table>

  <!-- ================= DEAL DETAILS TABLE ================= -->
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:10px;font-size:12px;">
    <tr style="border-bottom:1px solid #000;">
      <td colspan="2" style="padding:5px;font-weight:bold;">सौदा विवरण</td>
    </tr>

    ${[
                    ['डिलीवरी -', currentRow.deliveryType || '', 'चावल का भाव/दर -', riceRate.toFixed(2)],
                    ['LOT/अन्य -', currentRow.lotOrOther || '', 'बटाव % -', discountPercent],
                    ['FCI/NAN -', currentRow.fciOrNAN || '', 'दलाली -', brokerage.toFixed(2)],
                    ['चावल का प्रकार -', currentRow.riceType || '', 'बारदाना सहित/वापसी -', currentRow.gunnyType || ''],
                    ['FRK -', currentRow.frkType || '', 'नया बारदाना दर -', newGunnyRate.toFixed(2)],
                    ['FRK दर (प्रति किं.) -', safeNumber(currentRow.frkRatePerQuintal).toFixed(2), 'पुराना बारदाना दर -', oldGunnyRate.toFixed(2)],
                    ['LOT No. -', currentRow.lotNumber || '', 'प्लास्टिक बारदाना दर -', plasticGunnyRate.toFixed(2)],
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
                    ['आवक / LOT जमा', lifting.toFixed(2)],
                    ['धान की राशि (उठाव * दर)', riceAmount.toFixed(2)],
                    [`(-) बटाव राशि (${discountPercent}%)`, discountAmount.toFixed(2)],
                    ['(+) बारदाने की राशि', gunnyAmount.toFixed(2)],
                    ['पार्टी को भुगतान योग्य राशि', payableToParty.toFixed(2), true],
                    ['ब्रोकर को भुगतान योग्य राशि (उठाव * दलाली)', payableToBroker.toFixed(2), true]
                ].map(row => `
      <tr style="border-bottom:1px solid #000;">
        <td style="padding:5px;width:60%;border-right:1px solid #000;${row[2] ? 'font-weight:bold;' : ''}">
          ${row[0] === '(+) बारदाने की राशि' ? `
            ${row[0]} <span style="font-size:10px;font-weight:normal;color:#666;">(New: ${totalNewGunny}, Old: ${totalOldGunny}, Plastic: ${totalPlasticGunny})</span>
          ` : row[0]}
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
