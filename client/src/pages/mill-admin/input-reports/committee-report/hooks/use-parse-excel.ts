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
                        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
                        
                        // Read ALL data as arrays first (including header)
                        const allRows = XLSX.utils.sheet_to_json(worksheet, {
                            header: 1,
                            defval: ''
                        }) as unknown[][]

                        if (allRows.length < 2) {
                            toast.error('Excel file must have header and data rows')
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

                        // Extract header from first row
                        const headerRow = allRows[0]
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

                        // Convert array row to object using header - map by POSITION not by name
                        const arrayToObject = (row: unknown[]): Record<string, unknown> | null => {
                            if (!Array.isArray(row)) return null
                            
                            const obj: Record<string, unknown> = {}
                            
                            // Map by column position:
                            // Col 0 = committeeType
                            // Col 1 = committeeName
                            if (row[0] !== null && row[0] !== undefined && row[0] !== '') {
                                obj['committeeType'] = row[0]
                            }
                            if (row[1] !== null && row[1] !== undefined && row[1] !== '') {
                                obj['committeeName'] = row[1]
                            }
                            
                            return obj
                        }

                        // Process rows (skip header at index 0)
                        const errorDetails: string[] = []
                        let successCount = 0
                        let failCount = 0
                        const validatedData: Array<Record<string, unknown>> = []

                        for (let i = 1; i < allRows.length; i++) {
                            try {
                                const row = allRows[i]

                                // Check if row is array
                                if (!Array.isArray(row)) {
                                    failCount++
                                    errorDetails.push(`Row ${i + 1}: Invalid row format`)
                                    continue
                                }

                                // Check if has any data - SILENTLY skip empty rows (don't count as error)
                                const hasData = row.some(cell => cell !== null && cell !== undefined && cell !== '')
                                if (!hasData) {
                                    continue  // Just skip, don't count as error
                                }

                                // Convert array to object
                                const objRow = arrayToObject(row)
                                if (!objRow) {
                                    failCount++
                                    errorDetails.push(`Row ${i + 1}: Could not parse row`)
                                    continue
                                }

                                // Check for required field
                                if (!objRow['committeeName']) {
                                    failCount++
                                    errorDetails.push(`Row ${i + 1}: Committee name is required`)
                                    continue
                                }

                                validatedData.push(objRow)
                                successCount++
                            } catch (error) {
                                failCount++
                                errorDetails.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
                            }
                        }

                        if (validatedData.length === 0) {
                            toast.error('No valid committees found')
                            setParseStats({
                                totalRows: allRows.length - 1,
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
                            totalRows: allRows.length - 1,
                            successRows: successCount,
                            failedRows: failCount,
                            errorDetails: errorDetails.length > 5
                                ? [...errorDetails.slice(0, 5), `... and ${errorDetails.length - 5} more errors`]
                                : errorDetails,
                            hasHeaders: true,
                        }

                        setParseStats(stats)

                        if (successCount > 0) {
                            toast.success(`Loaded ${successCount} records${failCount > 0 ? ` (${failCount} skipped)` : ''}`)
                        }

                        if (failCount > 0) {
                            toast.warning(`${failCount} rows could not be parsed`)
                        }

                        setIsLoading(false)
                        resolve({ data: validatedData, stats })
                    } catch (error) {
                        toast.error('Failed to read Excel file')
                        console.error('Error reading file:', error)
                        setParseStats({
                            totalRows: 0,
                            successRows: 0,
                            failedRows: 0,
                            errorDetails: [error instanceof Error ? error.message : 'Unknown error'],
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
                    hasHeaders: true,
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
