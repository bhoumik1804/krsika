import { useState } from 'react'
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
}

export function useParseExcel() {
    const [parseStats, setParseStats] = useState<ParseStats | null>(null)
    const [isLoading, setIsLoading] = useState(false)

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
                        // Use header: 1 to get all rows as arrays (no header skipping)
                        const rawData = XLSX.utils.sheet_to_json(worksheet, {
                            header: 1,
                        }) as unknown[][]

                        // Filter out completely empty rows (where all cells are null/undefined/'')
                        const jsonData = rawData.filter((row) => {
                            if (!Array.isArray(row)) return false
                            return row.some(
                                (cell) =>
                                    cell !== null &&
                                    cell !== undefined &&
                                    cell !== ''
                            )
                        })

                        if (jsonData.length === 0) {
                            toast.error('No data found in the Excel file')
                            setParseStats({
                                totalRows: 0,
                                successRows: 0,
                                failedRows: 0,
                                errorDetails: ['No data found in file'],
                                hasHeaders: false,
                            })
                            setIsLoading(false)
                            resolve(null)
                            return
                        }

                        // Validate and count successful/failed rows
                        const errorDetails: string[] = []
                        let successCount = 0
                        let failCount = 0

                        const validatedData = jsonData.filter((row, index) => {
                            try {
                                // Check if row has any data
                                const hasData = row.some(
                                    (cell) =>
                                        cell !== null &&
                                        cell !== undefined &&
                                        cell !== ''
                                )

                                if (hasData) {
                                    successCount++
                                    return true
                                } else {
                                    failCount++
                                    errorDetails.push(
                                        `Row ${index + 1}: No data or all fields are empty`
                                    )
                                    return false
                                }
                            } catch (error) {
                                failCount++
                                errorDetails.push(
                                    `Row ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`
                                )
                                return false
                            }
                        })

                        const stats: ParseStats = {
                            totalRows: jsonData.length,
                            successRows: successCount,
                            failedRows: failCount,
                            errorDetails:
                                errorDetails.length > 5
                                    ? [
                                          ...errorDetails.slice(0, 5),
                                          `... and ${errorDetails.length - 5} more errors`,
                                      ]
                                    : errorDetails,
                            hasHeaders: false,
                        }

                        setParseStats(stats)

                        if (successCount > 0) {
                            toast.success(
                                `Loaded ${successCount} records${failCount > 0 ? ` (${failCount} skipped)` : ''}`
                            )
                        }

                        if (failCount > 0) {
                            toast.warning(
                                `${failCount} rows could not be parsed and were skipped`
                            )
                        }

                        setIsLoading(false)
                        resolve({
                            data: validatedData,
                            stats,
                        })
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
