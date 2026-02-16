import { format } from 'date-fns'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { Printer } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

// Define the shape of your data for type safety
interface PurchaseRecord {
    inwardData?: any[]
    paddyRatePerQuintal?: number | string
    discountPercent?: number | string
    newGunnyRate?: number | string
    oldGunnyRate?: number | string
    plasticGunnyRate?: number | string
    brokerage?: number | string
    paddyPurchaseDealNumber?: string
    date?: string
    partyName?: string
    brokerName?: string
    deliveryType?: string
    purchaseType?: string
    doPaddyQty?: number | string
    doNumber?: string
    gunnyType?: string
    committeeName?: string
    paddyType?: string
    totalPaddyQty?: number | string
}

export function BalanceLiftingPurchasesPaddyViewDialog({
    open,
    onOpenChange,
    currentRow,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PurchaseRecord | any
}) {
    if (!currentRow) return null

    // Helper to safely parse numbers
    const safeNumber = (val: any) => Number(val) || 0

    const inwardData = currentRow.inwardData || []

    // --- Calculations ---

    // 1. Lifting (Total Paddy Weight)
    const lifting = inwardData.reduce(
        (acc: number, curr: any) => acc + safeNumber(curr.paddyMota),
        0
    )

    // 2. Paddy Amount
    const paddyRate = safeNumber(currentRow.paddyRatePerQuintal)
    const paddyAmount = lifting * paddyRate

    // 3. Discount
    const discountPercent = safeNumber(currentRow.discountPercent)
    const discountAmount = paddyAmount * (discountPercent / 100)

    // 4. Gunny Calculations
    const totalNewGunny = inwardData.reduce(
        (acc: number, curr: any) => acc + safeNumber(curr.gunnyNew),
        0
    )
    const totalOldGunny = inwardData.reduce(
        (acc: number, curr: any) => acc + safeNumber(curr.gunnyOld),
        0
    )
    const totalPlasticGunny = inwardData.reduce(
        (acc: number, curr: any) => acc + safeNumber(curr.gunnyPlastic),
        0
    )

    const newGunnyRate = safeNumber(currentRow.newGunnyRate)
    const oldGunnyRate = safeNumber(currentRow.oldGunnyRate)
    const plasticGunnyRate = safeNumber(currentRow.plasticGunnyRate)

    const gunnyAmount =
        totalNewGunny * newGunnyRate +
        totalOldGunny * oldGunnyRate +
        totalPlasticGunny * plasticGunnyRate

    // 5. Final Payable
    const payableToParty = paddyAmount + gunnyAmount - discountAmount

    // 6. Brokerage
    const brokerage = safeNumber(currentRow.brokerage)
    const payableToBroker = lifting * brokerage

    // --- Print Handler ---
    const handlePrint = async () => {
        const toastId = toast.loading('Generating PDF...')

        try {
            // Build HTML with inline hex colors only - html2canvas doesn't support oklch
            const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;background:#fff;color:#000;font-family:sans-serif;">
<div id="pdf-content" style="width:210mm;background:#fff;color:#000;">
  <div style="margin-bottom:24px;display:flex;flex-direction:column;align-items:center;">
    <h2 style="margin:0 0 4px;font-size:20px;font-weight:bold;text-decoration:underline;">धान खरीदी सौदे की जानकारी</h2>
    <p style="margin:0;font-size:12px;color:#6b7280;">Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
  </div>
  <div style="margin-bottom:24px;display:grid;grid-template-columns:1fr 1fr;gap:8px 32px;border:1px solid #e5e7eb;border-radius:6px;padding:16px;font-size:14px;">
    <div style="display:flex;justify-content:space-between;"><span style="font-weight:bold;">धान खरीदी सौदा क्रमांक:</span><span>${currentRow.paddyPurchaseDealNumber || 'N/A'}</span></div>
    <div style="display:flex;justify-content:space-between;"><span style="font-weight:bold;">सौदा दिनांक:</span><span>${currentRow.date ? format(new Date(currentRow.date), 'dd/MM/yyyy') : 'N/A'}</span></div>
    <div style="display:flex;justify-content:space-between;"><span style="font-weight:bold;">पार्टी का नाम:</span><span>${currentRow.partyName || 'N/A'}</span></div>
    <div style="display:flex;justify-content:space-between;"><span style="font-weight:bold;">ब्रोकर का नाम:</span><span>${currentRow.brokerName || 'N/A'}</span></div>
  </div>
  <table style="margin-bottom:24px;width:100%;border-collapse:collapse;border:1px solid #000;font-size:14px;">
    <thead><tr><th colspan="2" style="border:1px solid #000;background:#f3f4f6;padding:8px;text-align:center;font-weight:bold;">सौदा विवरण</th></tr></thead>
    <tbody>
      <tr><td style="width:50%;border:1px solid #000;padding:8px;"><span style="font-weight:bold;">डिलीवरी:</span> ${currentRow.deliveryType || 'N/A'}</td><td style="width:50%;border:1px solid #000;padding:8px;"><span style="font-weight:bold;">धान का भाव/दर:</span> ${paddyRate.toFixed(2)}</td></tr>
      <tr><td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">खरीदी प्रकार:</span> ${currentRow.purchaseType || 'N/A'}</td><td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">बटाव %:</span> ${discountPercent}%</td></tr>
      <tr><td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">DO की जानकारी (Qty):</span> ${currentRow.doPaddyQty || 0}</td><td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">दलाली:</span> ${brokerage.toFixed(2)}</td></tr>
      <tr><td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">DO क्रमांक:</span> ${currentRow.doNumber || 'N/A'}</td><td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">बारदाना सहित/वापसी:</span> ${currentRow.gunnyType || 'N/A'}</td></tr>
      <tr><td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">समिति/संग्रहण का नाम:</span> ${currentRow.committeeName || 'N/A'}</td><td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">नया बारदाना दर:</span> ${newGunnyRate.toFixed(2)}</td></tr>
      <tr><td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">धान का प्रकार:</span> ${currentRow.paddyType || 'N/A'}</td><td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">पुराना बारदाना दर:</span> ${oldGunnyRate.toFixed(2)}</td></tr>
      <tr><td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">कुल धान की मात्रा:</span> ${currentRow.totalPaddyQty || 0}</td><td style="border:1px solid #000;padding:8px;"><span style="font-weight:bold;">प्लास्टिक बारदाना दर:</span> ${plasticGunnyRate.toFixed(2)}</td></tr>
    </tbody>
  </table>
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;font-size:14px;">
    <tbody>
      <tr><td style="width:66%;border:1px solid #000;padding:8px;font-weight:bold;">उठाव (Weight)</td><td style="width:33%;border:1px solid #000;padding:8px;text-align:right;">${lifting.toFixed(2)}</td></tr>
      <tr><td style="border:1px solid #000;padding:8px;font-weight:bold;">धान की राशि (उठाव * दर)</td><td style="border:1px solid #000;padding:8px;text-align:right;">${paddyAmount.toFixed(2)}</td></tr>
      <tr><td style="border:1px solid #000;padding:8px;font-weight:bold;">(-) बटाव राशि (${discountPercent}%)</td><td style="border:1px solid #000;padding:8px;text-align:right;color:#dc2626;">${discountAmount.toFixed(2)}</td></tr>
      <tr><td style="border:1px solid #000;padding:8px;font-weight:bold;">(+) बारदाने की राशि<div style="font-size:12px;font-weight:normal;color:#6b7280;">(New: ${totalNewGunny}, Old: ${totalOldGunny}, Plastic: ${totalPlasticGunny})</div></td><td style="border:1px solid #000;padding:8px;text-align:right;vertical-align:top;">${gunnyAmount.toFixed(2)}</td></tr>
      <tr style="background:#f3f4f6;"><td style="border:1px solid #000;padding:8px;font-size:16px;font-weight:bold;">पार्टी को भुगतान योग्य राशि (Net Payable)</td><td style="border:1px solid #000;padding:8px;text-align:right;font-size:16px;font-weight:bold;">${payableToParty.toFixed(2)}</td></tr>
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
            iframe.style.width = '210mm'
            document.body.appendChild(iframe)
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
            if (!iframeDoc) throw new Error('Could not access iframe document')
            iframeDoc.open()
            iframeDoc.write(html)
            iframeDoc.close()

            await new Promise((resolve) => setTimeout(resolve, 100))

            const target = iframeDoc.getElementById('pdf-content')
            if (!target) throw new Error('PDF content not found')

            const canvas = await html2canvas(target, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
            })

            document.body.removeChild(iframe)

            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            })

            const imgProps = pdf.getImageProperties(imgData)
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

            // Add image with a slight margin if needed, currently 0,0
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

            pdf.save(
                `paddy-purchase-${currentRow.paddyPurchaseDealNumber || 'details'}.pdf`
            )
            toast.success('PDF downloaded successfully!', { id: toastId })
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
                    <DialogTitle>View Paddy Purchase Details</DialogTitle>
                </DialogHeader>

                <div className='max-h-[75vh] overflow-y-auto p-2'>
                    {/* ID used for capturing the content */}
                    <div
                        id='printable-content'
                        className='bg-white p-4 text-black'
                    >
                        {/* Header Section */}
                        <div className='mb-6 flex flex-col items-center'>
                            <h2 className='mb-1 text-xl font-bold underline'>
                                धान खरीदी सौदे की जानकारी
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
                                    धान खरीदी सौदा क्रमांक:
                                </span>
                                <span>
                                    {currentRow.paddyPurchaseDealNumber ||
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
                                            धान का भाव/दर:
                                        </span>{' '}
                                        {paddyRate.toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='border border-black p-2'>
                                        <span className='font-bold'>
                                            खरीदी प्रकार:
                                        </span>{' '}
                                        {currentRow.purchaseType || 'N/A'}
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
                                            DO की जानकारी (Qty):
                                        </span>{' '}
                                        {currentRow.doPaddyQty || 0}
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
                                            DO क्रमांक:
                                        </span>{' '}
                                        {currentRow.doNumber || 'N/A'}
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
                                        <span className='font-bold'>
                                            समिति/संग्रहण का नाम:
                                        </span>{' '}
                                        {currentRow.committeeName || 'N/A'}
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
                                            धान का प्रकार:
                                        </span>{' '}
                                        {currentRow.paddyType || 'N/A'}
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
                                            कुल धान की मात्रा:
                                        </span>{' '}
                                        {currentRow.totalPaddyQty || 0}
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
                                        उठाव (Weight)
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
                                        {paddyAmount.toFixed(2)}
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
                                        पार्टी को भुगतान योग्य राशि (Net
                                        Payable)
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

                <DialogFooter>
                    <Button variant='outline' onClick={handlePrint}>
                        <Printer className='mr-2 h-4 w-4' />
                        Print / Export PDF
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
