import { useState } from 'react'
import { format, parse } from 'date-fns'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

export interface ParseStats {
    totalRows: number
    successRows: number
    failedRows: number
    errorDetails: string[]
    hasHeaders: boolean
}

export interface ParseResult {
    data: unknown[]
    stats: ParseStats
    headers: string[]
}

export function useParseExcel() {
    const [parseStats, setParseStats] = useState<ParseStats | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const normalizeDate = (value: unknown): string | null => {
        if (value instanceof Date) {
            return format(value, 'yyyy-MM-dd')
        }

        if (typeof value === 'number') {
            const date = XLSX.SSF.parse_date_code(value)
            if (date && date.y && date.m && date.d) {
                return format(
                    new Date(date.y, date.m - 1, date.d),
                    'yyyy-MM-dd'
                )
            }
        }

        if (typeof value === 'string') {
            const trimmed = value.trim()
            if (!trimmed) return null

            if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
                const parsed = parse(trimmed, 'dd-MM-yyyy', new Date())
                if (!isNaN(parsed.getTime())) {
                    return format(parsed, 'yyyy-MM-dd')
                }
            }

            if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
                const parsed = parse(trimmed, 'dd/MM/yyyy', new Date())
                if (!isNaN(parsed.getTime())) {
                    return format(parsed, 'yyyy-MM-dd')
                }
            }

            const parsed = new Date(trimmed)
            if (!isNaN(parsed.getTime())) {
                return format(parsed, 'yyyy-MM-dd')
            }
        }

        return null
    }

    const normalizeNumber = (value: unknown): number | null => {
        if (typeof value === 'number') return value
        if (typeof value === 'string') {
            const trimmed = value.trim().replace(/,/g, '')
            if (!trimmed) return null
            const parsed = Number(trimmed)
            return Number.isNaN(parsed) ? null : parsed
        }
        return null
    }

    const isCellEmpty = (value: unknown): boolean => {
        if (value === null || value === undefined) return true
        if (typeof value === 'string') return value.trim() === ''
        return false
    }

    const parseFile = async (file: File): Promise<ParseResult | null> => {
        setIsLoading(true)

        return new Promise((resolve) => {
            try {
                const reader = new FileReader()

                reader.onload = (event) => {
                    try {
                        const data = event.target?.result as ArrayBuffer
                        const workbook = XLSX.read(data, { type: 'array' })
                        const worksheet =
                            workbook.Sheets[workbook.SheetNames[0]]
                        const allRows = XLSX.utils.sheet_to_json(worksheet, {
                            header: 1,
                            defval: '',
                        }) as unknown[][]

                        if (allRows.length < 2) {
                            toast.error(
                                'Excel file must have header and data rows'
                            )
                            setParseStats({
                                totalRows: 0,
                                successRows: 0,
                                failedRows: 0,
                                errorDetails: ['File has no data rows'],
                                hasHeaders: true,
                            })
                            setIsLoading(false)
                            resolve(null)
                            return
                        }

                        const normalizeHeader = (value: unknown): string => {
                            if (value === null || value === undefined) return ''
                            return String(value)
                                .trim()
                                .toLowerCase()
                                .replace(/\s+/g, '')
                                .replace(/[.\-_/]/g, '')
                        }

                        const headerTokens = [
                            'समिती-उपार्जनकेन्द्र',
                            'समिति-उपार्जनकेंद्र',
                            'समिती - उपार्जन केन्द्र',
                            'समिति उपार्जन केंद्र',
                            'डीओ',
                            'डी.ओ.',
                            'डी.ओ',
                            'डीओदिनांक',
                            'डी.ओ.दिनांक',
                            'डी.ओदिनांक',
                            'मोटा',
                            'पतला',
                            'सरना',
                            'कुल',
                        ].map((token) => normalizeHeader(token))

                        const findHeaderRowIndex = (
                            rows: unknown[][],
                            maxScan: number
                        ): number => {
                            let bestIndex = 0
                            let bestScore = 0

                            const scanLimit = Math.min(rows.length, maxScan)
                            for (let i = 0; i < scanLimit; i++) {
                                const row = rows[i]
                                if (!Array.isArray(row)) continue
                                let score = 0

                                for (const cell of row) {
                                    const normalized = normalizeHeader(cell)
                                    if (!normalized) continue
                                    if (
                                        headerTokens.some((token) =>
                                            normalized.includes(token)
                                        )
                                    ) {
                                        score++
                                    }
                                }

                                if (score > bestScore) {
                                    bestScore = score
                                    bestIndex = i
                                }
                            }

                            return bestScore >= 2 ? bestIndex : 0
                        }

                        const headerRowIndex = findHeaderRowIndex(allRows, 10)
                        const headerRow = allRows[headerRowIndex]
                        if (!Array.isArray(headerRow)) {
                            toast.error('Invalid Excel format')
                            setParseStats({
                                totalRows: 0,
                                successRows: 0,
                                failedRows: 0,
                                errorDetails: ['Invalid header row'],
                                hasHeaders: false,
                            })
                            setIsLoading(false)
                            resolve(null)
                            return
                        }

                        const headers = headerRow.map((value) =>
                            String(value ?? '').trim()
                        )

                        const findColumnIndex = (
                            headers: unknown[],
                            keywords: string[]
                        ): number | null => {
                            const normalizedKeywords = keywords.map((keyword) =>
                                normalizeHeader(keyword)
                            )
                            for (let i = 0; i < headers.length; i++) {
                                const header = normalizeHeader(headers[i])
                                if (!header) continue
                                if (
                                    normalizedKeywords.some((keyword) =>
                                        header.includes(keyword)
                                    )
                                ) {
                                    return i
                                }
                            }
                            return null
                        }

                        const columnMap = {
                            samitiSangrahan: findColumnIndex(headerRow, [
                                'समिती-उपार्जनकेन्द्र',
                                'समिति-उपार्जनकेंद्र',
                                'समिती - उपार्जन केन्द्र',
                                'समिति उपार्जन केंद्र',
                            ]),
                            doNo: findColumnIndex(headerRow, [
                                'डीओ',
                                'डी.ओ.',
                                'डी.ओ',
                            ]),
                            date: findColumnIndex(headerRow, [
                                'डीओदिनांक',
                                'डी.ओ.दिनांक',
                                'डी.ओदिनांक',
                            ]),
                            dhanMota: findColumnIndex(headerRow, ['मोटा']),
                            dhanPatla: findColumnIndex(headerRow, ['पतला']),
                            dhanSarna: findColumnIndex(headerRow, ['सरना']),
                            total: findColumnIndex(headerRow, ['कुल']),
                        }

                        const resolveIndex = (
                            index: number | null,
                            fallbackIndex: number
                        ) =>
                            index !== null && index >= 0 ? index : fallbackIndex

                        const columnIndex = {
                            samitiSangrahan: resolveIndex(
                                columnMap.samitiSangrahan,
                                0
                            ),
                            doNo: resolveIndex(columnMap.doNo, 1),
                            date: resolveIndex(columnMap.date, 2),
                            dhanMota: resolveIndex(columnMap.dhanMota, 3),
                            dhanPatla: resolveIndex(columnMap.dhanPatla, 4),
                            dhanSarna: resolveIndex(columnMap.dhanSarna, 5),
                            total: resolveIndex(columnMap.total, 6),
                        }

                        const arrayToObject = (
                            row: unknown[]
                        ): Record<string, unknown> | null => {
                            if (!Array.isArray(row)) return null

                            const obj: Record<string, unknown> = {}

                            // Map by header when possible, fallback to expected positions:
                            // Col 0 = samitiSangrahan
                            // Col 1 = doNo
                            // Col 2 = date
                            // Col 3 = dhanMota
                            // Col 4 = dhanPatla
                            // Col 5 = dhanSarna
                            // Col 6 = total
                            const dateValue = normalizeDate(
                                row[columnIndex.date]
                            )
                            if (dateValue) obj['date'] = dateValue
                            const samitiValue = row[columnIndex.samitiSangrahan]
                            if (!isCellEmpty(samitiValue)) {
                                obj['samitiSangrahan'] = samitiValue
                            }
                            const doNoValue = row[columnIndex.doNo]
                            if (!isCellEmpty(doNoValue)) {
                                obj['doNo'] = doNoValue
                            }

                            const dhanMota = normalizeNumber(
                                row[columnIndex.dhanMota]
                            )
                            if (dhanMota !== null) obj['dhanMota'] = dhanMota

                            const dhanPatla = normalizeNumber(
                                row[columnIndex.dhanPatla]
                            )
                            if (dhanPatla !== null) obj['dhanPatla'] = dhanPatla

                            const dhanSarna = normalizeNumber(
                                row[columnIndex.dhanSarna]
                            )
                            if (dhanSarna !== null) obj['dhanSarna'] = dhanSarna

                            const totalValue = normalizeNumber(
                                row[columnIndex.total]
                            )
                            if (totalValue !== null) {
                                obj['total'] = totalValue
                            } else if (
                                dhanMota !== null ||
                                dhanPatla !== null ||
                                dhanSarna !== null
                            ) {
                                obj['total'] =
                                    (dhanMota ?? 0) +
                                    (dhanPatla ?? 0) +
                                    (dhanSarna ?? 0)
                            }

                            return obj
                        }

                        const errorDetails: string[] = []
                        let successCount = 0
                        let failCount = 0
                        const validatedData: Array<Record<string, unknown>> = []

                        for (
                            let i = headerRowIndex + 1;
                            i < allRows.length;
                            i++
                        ) {
                            try {
                                const row = allRows[i]

                                if (!Array.isArray(row)) {
                                    failCount++
                                    errorDetails.push(
                                        `Row ${i + 1}: Invalid row format`
                                    )
                                    continue
                                }

                                // Skip empty rows - check if all cells are empty, null, undefined, or whitespace
                                const hasData = row.some(
                                    (cell) => !isCellEmpty(cell)
                                )
                                if (!hasData) {
                                    continue
                                }

                                const objRow = arrayToObject(row)
                                if (!objRow) {
                                    failCount++
                                    errorDetails.push(
                                        `Row ${i + 1}: Could not parse row`
                                    )
                                    continue
                                }

                                if (!objRow['date']) {
                                    failCount++
                                    errorDetails.push(
                                        `Row ${i + 1}: Date is required`
                                    )
                                    continue
                                }

                                validatedData.push(objRow)
                                successCount++
                            } catch (error) {
                                failCount++
                                errorDetails.push(
                                    `Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`
                                )
                            }
                        }

                        const totalRows = Math.max(
                            allRows.length - headerRowIndex - 1,
                            0
                        )

                        if (validatedData.length === 0) {
                            toast.error('No valid DO report entries found')
                            setParseStats({
                                totalRows,
                                successRows: 0,
                                failedRows: failCount,
                                errorDetails,
                                hasHeaders: true,
                            })
                            setIsLoading(false)
                            resolve(null)
                            return
                        }

                        const stats: ParseStats = {
                            totalRows,
                            successRows: successCount,
                            failedRows: failCount,
                            errorDetails:
                                errorDetails.length > 5
                                    ? [
                                          ...errorDetails.slice(0, 5),
                                          `... and ${errorDetails.length - 5} more errors`,
                                      ]
                                    : errorDetails,
                            hasHeaders: true,
                        }

                        setParseStats(stats)

                        if (successCount > 0) {
                            toast.success(
                                `Loaded ${successCount} records${failCount > 0 ? ` (${failCount} skipped)` : ''}`
                            )
                        }

                        if (failCount > 0) {
                            toast.warning(
                                `${failCount} rows could not be parsed`
                            )
                        }

                        setIsLoading(false)
                        resolve({ data: validatedData, stats, headers })
                    } catch (error) {
                        toast.error(
                            'Failed to read Excel file. Please check the format.'
                        )
                        console.error('Error reading file:', error)
                        setParseStats({
                            totalRows: 0,
                            successRows: 0,
                            failedRows: 0,
                            errorDetails: [
                                error instanceof Error
                                    ? error.message
                                    : 'Unknown error',
                            ],
                            hasHeaders: false,
                        })
                        setIsLoading(false)
                        resolve(null)
                    }
                }

                reader.readAsArrayBuffer(file)
            } catch (error) {
                toast.error('Failed to process file')
                console.error('Error processing file:', error)
                setParseStats({
                    totalRows: 0,
                    successRows: 0,
                    failedRows: 0,
                    errorDetails: [
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                    ],
                    hasHeaders: false,
                })
                setIsLoading(false)
                resolve(null)
            }
        })
    }

    return {
        parseFile,
        parseStats,
        isLoading,
    }
}
